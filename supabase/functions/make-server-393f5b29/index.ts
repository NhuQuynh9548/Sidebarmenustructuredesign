import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
import * as api from "./api.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-393f5b29/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== BUSINESS UNITS ====================
app.get("/make-server-393f5b29/business-units", async (c) => {
  try {
    const bus = await api.getBusinessUnits();
    return c.json({ success: true, data: bus });
  } catch (error) {
    console.error('Error fetching business units:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-393f5b29/business-units/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const bu = await api.getBusinessUnit(id);
    if (!bu) {
      return c.json({ success: false, error: 'Business unit not found' }, 404);
    }
    return c.json({ success: true, data: bu });
  } catch (error) {
    console.error('Error fetching business unit:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-393f5b29/business-units", async (c) => {
  try {
    const data = await c.req.json();
    const bu = await api.createBusinessUnit(data);
    return c.json({ success: true, data: bu });
  } catch (error) {
    console.error('Error creating business unit:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-393f5b29/business-units/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    const bu = await api.updateBusinessUnit(id, data);
    return c.json({ success: true, data: bu });
  } catch (error) {
    console.error('Error updating business unit:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-393f5b29/business-units/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await api.deleteBusinessUnit(id);
    return c.json({ success: true, message: 'Business unit deleted' });
  } catch (error) {
    console.error('Error deleting business unit:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== TRANSACTIONS ====================
app.get("/make-server-393f5b29/transactions", async (c) => {
  try {
    const transactions = await api.getTransactions();
    return c.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-393f5b29/transactions/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const transaction = await api.getTransaction(id);
    if (!transaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404);
    }
    return c.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-393f5b29/transactions", async (c) => {
  try {
    const data = await c.req.json();
    const transaction = await api.createTransaction(data);
    return c.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-393f5b29/transactions/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    const transaction = await api.updateTransaction(id, data);
    return c.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-393f5b29/transactions/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await api.deleteTransaction(id);
    return c.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== EMPLOYEES ====================
app.get("/make-server-393f5b29/employees", async (c) => {
  try {
    const employees = await api.getEmployees();
    return c.json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-393f5b29/employees", async (c) => {
  try {
    const data = await c.req.json();
    const employee = await api.createEmployee(data);
    return c.json({ success: true, data: employee });
  } catch (error) {
    console.error('Error creating employee:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-393f5b29/employees/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    const employee = await api.updateEmployee(id, data);
    return c.json({ success: true, data: employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-393f5b29/employees/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await api.deleteEmployee(id);
    return c.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== PARTNERS ====================
app.get("/make-server-393f5b29/partners", async (c) => {
  try {
    const partners = await api.getPartners();
    return c.json({ success: true, data: partners });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-393f5b29/partners", async (c) => {
  try {
    const data = await c.req.json();
    const partner = await api.createPartner(data);
    return c.json({ success: true, data: partner });
  } catch (error) {
    console.error('Error creating partner:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-393f5b29/partners/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    const partner = await api.updatePartner(id, data);
    return c.json({ success: true, data: partner });
  } catch (error) {
    console.error('Error updating partner:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-393f5b29/partners/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await api.deletePartner(id);
    return c.json({ success: true, message: 'Partner deleted' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== USERS ====================
app.get("/make-server-393f5b29/users", async (c) => {
  try {
    const users = await api.getUsers();
    return c.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-393f5b29/users", async (c) => {
  try {
    const data = await c.req.json();
    const user = await api.createUser(data);
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-393f5b29/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    const user = await api.updateUser(id, data);
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-393f5b29/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await api.deleteUser(id);
    return c.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== MASTER DATA ====================
app.get("/make-server-393f5b29/master/:type", async (c) => {
  try {
    const type = c.req.param('type');
    const items = await api.getMasterData(type);
    return c.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching master data:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-393f5b29/master/:type", async (c) => {
  try {
    const type = c.req.param('type');
    const data = await c.req.json();
    const item = await api.createMasterData(type, data);
    return c.json({ success: true, data: item });
  } catch (error) {
    console.error('Error creating master data:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-393f5b29/master/:type/:id", async (c) => {
  try {
    const type = c.req.param('type');
    const id = c.req.param('id');
    const data = await c.req.json();
    const item = await api.updateMasterData(type, id, data);
    return c.json({ success: true, data: item });
  } catch (error) {
    console.error('Error updating master data:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-393f5b29/master/:type/:id", async (c) => {
  try {
    const type = c.req.param('type');
    const id = c.req.param('id');
    await api.deleteMasterData(type, id);
    return c.json({ success: true, message: 'Master data deleted' });
  } catch (error) {
    console.error('Error deleting master data:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== DASHBOARD ====================
app.post("/make-server-393f5b29/dashboard", async (c) => {
  try {
    const filters = await c.req.json();
    const data = await api.getDashboardData(filters);
    return c.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== SEED DATA ====================
app.post("/make-server-393f5b29/seed", async (c) => {
  try {
    // Seed Business Units
    const bus = [
      { buCode: 'BU001', buName: 'BlueBolt G&A', description: 'General & Administration', status: 'active', director: 'Nguyễn Văn A' },
      { buCode: 'BU002', buName: 'BlueBolt R&D', description: 'Research & Development', status: 'active', director: 'Trần Thị B' },
      { buCode: 'BU003', buName: 'BlueBolt Academy', description: 'Training & Education', status: 'active', director: 'Lê Văn C' },
      { buCode: 'BU004', buName: 'BlueBolt Services', description: 'Services Division', status: 'active', director: 'Phạm Văn D' },
      { buCode: 'BU005', buName: 'BlueBolt Software', description: 'Software Development', status: 'active', director: 'Hoàng Thị E' }
    ];

    for (const bu of bus) {
      await api.createBusinessUnit(bu);
    }

    return c.json({ 
      success: true, 
      message: 'Seed data created successfully',
      data: { businessUnitsCreated: bus.length }
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
