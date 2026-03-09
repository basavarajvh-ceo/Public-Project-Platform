import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Initialize Razorpay (Lazy initialization pattern)
  let razorpayClient: Razorpay | null = null;
  const getRazorpay = () => {
    if (!razorpayClient) {
      const key_id = process.env.RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      if (!key_id || !key_secret) {
        console.warn("⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Payment features will not work.");
        return null;
      }
      razorpayClient = new Razorpay({ key_id, key_secret });
    }
    return razorpayClient;
  };

  // --- API ROUTES ---
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Public Project API is running" });
  });

  // Mock Payment Endpoint (Razorpay Order Creation)
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { projectId, projectTitle, amount } = req.body;
      const razorpay = getRazorpay();

      if (!razorpay) {
        // Fallback for when Razorpay is not configured
        return res.status(200).json({ 
          mockUrl: `/payment-success?session_id=mock_session_${Date.now()}&project=${projectId}`,
          message: "Razorpay keys not found. Using mock payment flow."
        });
      }

      // Create an actual Razorpay order
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_${projectId}_${Date.now()}`,
        notes: {
          projectId,
          projectTitle
        }
      };

      const order = await razorpay.orders.create(options);
      
      // Send back order details to client
      res.json({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error: any) {
      console.error("Razorpay error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- VITE MIDDLEWARE (For Development & SPA Fallback) ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
