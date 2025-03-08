const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dbOperations = {
  // User Operations
  createUser: async (userData) => {
    try {
      const user = await prisma.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          address: userData.address,
          isAdmin: userData.isAdmin,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  getAllCustomers: async () => {
    try {
      const customers = await prisma.user.findMany({ where: {isAdmin: false} } );
      return customers;
    } catch (error) {
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const user = await prisma.user.findUnique({where: { email }});
      return user || null;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: userData,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await prisma.user.delete({
        where: { id },
      });
  
      return;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = {
  ...dbOperations,
};
