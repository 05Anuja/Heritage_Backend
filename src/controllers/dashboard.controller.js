import Product from "../models/Product.js";
import Enquiry from "../models/Enquiry.js";
import { todayDateRange } from "../utils/date.js";

// 1. DASHBOARD STATISTICS
export const getDashboardStats = async (req, res) => {
  try {
    // Today's date in Indian Standard Time
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    const startOfToday = new Date(
      Date.UTC(
        istNow.getUTCFullYear(),
        istNow.getUTCMonth(),
        istNow.getUTCDate(),
      ) - istOffset,
    );

    const startOfTomorrow = new Date(
      startOfToday.getTime() + 24 * 60 * 60 * 1000,
    );

    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      totalEnquiries,
      todayEnquiries,
    ] = await Promise.all([
      Product.countDocuments(),

      Product.countDocuments({ active: true }),

      Product.countDocuments({ active: false }),

      Product.countDocuments({ featured: true }),

      Enquiry.countDocuments(),

      Enquiry.countDocuments({
        createdAt: {
          $gte: startOfToday,
          $lt: startOfTomorrow,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        featuredProducts,
        totalEnquiries,
        todayEnquiries,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// 2. ENQUIRY ANALYTICS
export const getEnquiryAnalytics = async (req, res) => {
  try {
    const period = req.query.period || "7days";

    if (!["7days", "30days", "12months"].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Invalid period",
      });
    }

    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    let startDate;
    let endDate;
    let dateFormat;

    if (period === "12months") {
      startDate = new Date(
        Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth() - 11, 1) -
          istOffset,
      );

      endDate = new Date(
        Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth() + 1, 1) -
          istOffset,
      );

      dateFormat = "%Y-%m";
    } else {
      const days = period === "7days" ? 7 : 30;

      const todayStart = new Date(
        Date.UTC(
          istNow.getUTCFullYear(),
          istNow.getUTCMonth(),
          istNow.getUTCDate(),
        ) - istOffset,
      );

      startDate = new Date(
        todayStart.getTime() - (days - 1) * 24 * 60 * 60 * 1000,
      );

      endDate = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      dateFormat = "%Y-%m-%d";
    }

    const results = await Enquiry.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const countsByDate = new Map(results.map((item) => [item._id, item.count]));

    const analytics = [];

    if (period === "12months") {
      const firstMonth = new Date(
        Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth() - 11, 1),
      );

      for (let i = 0; i < 12; i++) {
        const month = new Date(
          Date.UTC(
            firstMonth.getUTCFullYear(),
            firstMonth.getUTCMonth() + i,
            1,
          ),
        );

        const key = [
          month.getUTCFullYear(),
          String(month.getUTCMonth() + 1).padStart(2, "0"),
        ].join("-");

        analytics.push({
          date: key,
          count: countsByDate.get(key) || 0,
        });
      }
    } else {
      const days = period === "7days" ? 7 : 30;

      const today = new Date(
        Date.UTC(
          istNow.getUTCFullYear(),
          istNow.getUTCMonth(),
          istNow.getUTCDate(),
        ),
      );

      for (let i = days - 1; i >= 0; i--) {
        const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);

        const key = [
          day.getUTCFullYear(),
          String(day.getUTCMonth() + 1).padStart(2, "0"),
          String(day.getUTCDate()).padStart(2, "0"),
        ].join("-");

        analytics.push({
          date: key,
          count: countsByDate.get(key) || 0,
        });
      }
    }

    return res.status(200).json({
      success: true,
      period,
      analytics,
    });
  } catch (error) {
    console.error("Enquiry Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry analytics",
      error: error.message,
    });
  }
};

// 3. RECENT PRODUCTS & ENQUIRIES
export const getRecentActivities = async (req, res) => {
  try {
    const { startOfDay, endOfDay } = todayDateRange();
    const [recentProducts, recentEnquiries] = await Promise.all([
      Product.find({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .sort({ createdAt: -1 })
        // .limit(5)
        .select("name category images active featured createdAt"),

      Enquiry.find({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .sort({ createdAt: -1 })
        // .limit(5)
        .select("name email phoneNo message createdAt"),
    ]);

    return res.status(200).json({
      success: true,
      recentProducts,
      recentEnquiries,
    });
  } catch (error) {
    console.error("Recent Activities Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities",
      error: error.message,
    });
  }
};
