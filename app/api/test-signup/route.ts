import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

/**
 * Test endpoint to verify signup functionality and MongoDB connection
 * GET /api/test-signup - Returns database status
 * POST /api/test-signup - Creates a test user (email: test-{timestamp}@example.com)
 */

export async function GET() {
  try {
    console.log("[Test] GET /api/test-signup - Testing MongoDB connection...");
    
    const db = await getDb();
    const users = db.collection("users");
    
    // Test basic database operation
    const count = await users.countDocuments({});
    console.log("[Test] Total users in database:", count);
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      databaseName: db.databaseName,
      totalUsers: count,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const errorStack = err instanceof Error ? err.stack : "";
    console.error("[Test] Database connection failed:", { message, errorStack });
    
    return NextResponse.json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log("[Test] POST /api/test-signup - Creating test user...");
    
    const db = await getDb();
    const users = db.collection("users");
    
    // Create a test user with a timestamp to ensure uniqueness
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@example.com`;
    const testPassword = "TestPassword123";
    const testName = "Test User";
    const testMobile = "+919876543210";
    
    // Hash the password
    const passwordHash = await bcrypt.hash(testPassword, 10);
    const now = new Date();
    
    // Check if user already exists
    const existing = await users.findOne({ email: testEmail });
    if (existing) {
      console.log("[Test] Test user already exists:", testEmail);
      return NextResponse.json({
        success: false,
        error: "Test user already exists",
        email: testEmail,
      }, { status: 409 });
    }
    
    // Insert test user
    const result = await users.insertOne({
      email: testEmail,
      name: testName,
      image: null,
      mobile: testMobile,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });
    
    if (!result.insertedId) {
      console.error("[Test] Failed to insert test user: insertedId is missing");
      return NextResponse.json({
        success: false,
        error: "Failed to create test user - no insertedId returned",
      }, { status: 500 });
    }
    
    console.log("[Test] Test user created successfully:", {
      email: testEmail,
      userId: result.insertedId,
    });
    
    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      testUser: {
        email: testEmail,
        password: testPassword,
        name: testName,
        mobile: testMobile,
        userId: result.insertedId.toString(),
      },
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const errorStack = err instanceof Error ? err.stack : "";
    console.error("[Test] Error creating test user:", { message, errorStack });
    
    return NextResponse.json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
