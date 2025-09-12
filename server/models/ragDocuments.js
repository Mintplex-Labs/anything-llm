const prisma = require("../utils/prisma");

const RagDocuments = {
  /**
   * Create a new RAG document record
   * @param {string} firestoreDocId - The Firestore document ID
   * @param {number} timesRetrieved - Initial times retrieved count (default: 0)
   * @param {number} timesLmmUsed - Initial times LMM used count (default: 0)
   * @param {number} usedIfRetrieved - Initial used if retrieved count (default: 0)
   * @returns {Promise<object|null>} Created document or null if failed
   */
  create: async function (firestoreDocId, timesRetrieved = 0, timesLmmUsed = 0, usedIfRetrieved = 0) {
    try {
      const document = await prisma.rag_documents.create({
        data: {
          firestoreDocId,
          timesRetrieved,
          timesLmmUsed,
          usedIfRetrieved,
        },
      });
      return document;
    } catch (error) {
      console.error("RagDocuments.create error:", error.message);
      return null;
    }
  },

  /**
   * Check if a document with the given firestoreDocId exists
   * @param {string} firestoreDocId - The Firestore document ID to check
   * @returns {Promise<boolean>} True if document exists, false otherwise
   */
  exists: async function (firestoreDocId) {
    try {
      const document = await prisma.rag_documents.findFirst({
        where: { firestoreDocId },
        select: { id: true },
      });
      return !!document;
    } catch (error) {
      console.error("RagDocuments.exists error:", error.message);
      return false;
    }
  },

  /**
   * Get a document by firestoreDocId
   * @param {string} firestoreDocId - The Firestore document ID
   * @returns {Promise<object|null>} Document record or null if not found
   */
  get: async function (firestoreDocId) {
    try {
      const document = await prisma.rag_documents.findFirst({
        where: { firestoreDocId },
      });
      return document || null;
    } catch (error) {
      console.error("RagDocuments.get error:", error.message);
      return null;
    }
  },

  /**
   * Increment the timesRetrieved counter for a document
   * @param {string} firestoreDocId - The Firestore document ID
   * @param {number} incrementBy - Amount to increment by (default: 1)
   * @returns {Promise<object|null>} Updated document or null if failed
   */
  incrementTimesRetrieved: async function (firestoreDocId, incrementBy = 1) {
    try {
      const document = await prisma.rag_documents.update({
        where: { firestoreDocId },
        data: {
          timesRetrieved: {
            increment: incrementBy,
          },
        },
      });
      return document;
    } catch (error) {
      console.error("RagDocuments.incrementTimesRetrieved error:", error.message);
      return null;
    }
  },

  /**
   * Increment the timesLmmUsed counter for a document
   * @param {string} firestoreDocId - The Firestore document ID
   * @param {number} incrementBy - Amount to increment by (default: 1)
   * @returns {Promise<object|null>} Updated document or null if failed
   */
  incrementTimesLmmUsed: async function (firestoreDocId, incrementBy = 1) {
    try {
      const document = await prisma.rag_documents.update({
        where: { firestoreDocId },
        data: {
          timesLmmUsed: {
            increment: incrementBy,
          },
        },
      });
      return document;
    } catch (error) {
      console.error("RagDocuments.incrementTimesLmmUsed error:", error.message);
      return null;
    }
  },

  /**
   * Increment the usedIfRetrieved counter for a document
   * @param {string} firestoreDocId - The Firestore document ID
   * @param {number} incrementBy - Amount to increment by (default: 1)
   * @returns {Promise<object|null>} Updated document or null if failed
   */
  incrementUsedIfRetrieved: async function (firestoreDocId, incrementBy = 1) {
    try {
      const document = await prisma.rag_documents.update({
        where: { firestoreDocId },
        data: {
          usedIfRetrieved: {
            increment: incrementBy,
          },
        },
      });
      return document;
    } catch (error) {
      console.error("RagDocuments.incrementUsedIfRetrieved error:", error.message);
      return null;
    }
  },

  /**
   * Increment all counters for a document in a single operation
   * @param {string} firestoreDocId - The Firestore document ID
   * @param {object} options - Options object for increments
   * @param {number} options.timesRetrieved - Amount to increment timesRetrieved (default: 0)
   * @param {number} options.timesLmmUsed - Amount to increment timesLmmUsed (default: 0)
   * @param {number} options.usedIfRetrieved - Amount to increment usedIfRetrieved (default: 0)
   * @returns {Promise<object|null>} Updated document or null if failed
   */
  incrementCounters: async function (firestoreDocId, { timesRetrieved = 0, timesLmmUsed = 0, usedIfRetrieved = 0 } = {}) {
    try {
      const updateData = {};
      
      if (timesRetrieved > 0) {
        updateData.timesRetrieved = { increment: timesRetrieved };
      }
      
      if (timesLmmUsed > 0) {
        updateData.timesLmmUsed = { increment: timesLmmUsed };
      }
      
      if (usedIfRetrieved > 0) {
        updateData.usedIfRetrieved = { increment: usedIfRetrieved };
      }

      // If no increments specified, return the document without updating
      if (Object.keys(updateData).length === 0) {
        return await this.get(firestoreDocId);
      }

      const document = await prisma.rag_documents.update({
        where: { firestoreDocId },
        data: updateData,
      });
      return document;
    } catch (error) {
      console.error("RagDocuments.incrementCounters error:", error.message);
      return null;
    }
  },

  /**
   * Create a document if it doesn't exist, or increment counters if it does
   * @param {string} firestoreDocId - The Firestore document ID
   * @param {object} options - Options object
   * @param {boolean} options.incrementRetrieved - Whether to increment timesRetrieved (default: false)
   * @param {boolean} options.incrementLmmUsed - Whether to increment timesLmmUsed (default: false)
   * @param {boolean} options.incrementUsedIfRetrieved - Whether to increment usedIfRetrieved (default: false)
   * @returns {Promise<object|null>} Document record or null if failed
   */
  upsert: async function (firestoreDocId, { incrementRetrieved = false, incrementLmmUsed = false, incrementUsedIfRetrieved = false } = {}) {
    try {
      const existingDoc = await this.get(firestoreDocId);
      
      if (existingDoc) {
        // Document exists, increment counters if requested
        const incrementOptions = {
          timesRetrieved: incrementRetrieved ? 1 : 0,
          timesLmmUsed: incrementLmmUsed ? 1 : 0,
          usedIfRetrieved: incrementUsedIfRetrieved ? 1 : 0,
        };
        
        return await this.incrementCounters(firestoreDocId, incrementOptions);
      } else {
        // Document doesn't exist, create new one
        const initialRetrieved = incrementRetrieved ? 1 : 0;
        const initialLmmUsed = incrementLmmUsed ? 1 : 0;
        const initialUsedIfRetrieved = incrementUsedIfRetrieved ? 1 : 0;
        
        return await this.create(firestoreDocId, initialRetrieved, initialLmmUsed, initialUsedIfRetrieved);
      }
    } catch (error) {
      console.error("RagDocuments.upsert error:", error.message);
      return null;
    }
  },

  /**
   * Get all documents with pagination
   * @param {number} limit - Maximum number of documents to return
   * @param {number} offset - Number of documents to skip
   * @param {object} orderBy - Order by clause (default: { createdAt: 'desc' })
   * @returns {Promise<Array>} Array of documents
   */
  getAll: async function (limit = 100, offset = 0, orderBy = { createdAt: 'desc' }) {
    try {
      const documents = await prisma.rag_documents.findMany({
        take: limit,
        skip: offset,
        orderBy,
      });
      return documents;
    } catch (error) {
      console.error("RagDocuments.getAll error:", error.message);
      return [];
    }
  },

  /**
   * Get documents with high usage statistics
   * @param {number} minRetrieved - Minimum times retrieved
   * @param {number} minLmmUsed - Minimum times LMM used
   * @param {number} limit - Maximum number of documents to return
   * @returns {Promise<Array>} Array of documents
   */
  getHighUsage: async function (minRetrieved = 10, minLmmUsed = 5, limit = 50) {
    try {
      const documents = await prisma.rag_documents.findMany({
        where: {
          OR: [
            { timesRetrieved: { gte: minRetrieved } },
            { timesLmmUsed: { gte: minLmmUsed } },
          ],
        },
        orderBy: [
          { timesRetrieved: 'desc' },
          { timesLmmUsed: 'desc' },
        ],
        take: limit,
      });
      return documents;
    } catch (error) {
      console.error("RagDocuments.getHighUsage error:", error.message);
      return [];
    }
  },

  /**
   * Delete a document by firestoreDocId
   * @param {string} firestoreDocId - The Firestore document ID
   * @returns {Promise<boolean>} True if deleted successfully, false otherwise
   */
  delete: async function (firestoreDocId) {
    try {
      await prisma.rag_documents.delete({
        where: { firestoreDocId },
      });
      return true;
    } catch (error) {
      console.error("RagDocuments.delete error:", error.message);
      return false;
    }
  },

  /**
   * Get usage statistics
   * @returns {Promise<object|null>} Statistics object or null if failed
   */
  getStatistics: async function () {
    try {
      const stats = await prisma.rag_documents.aggregate({
        _count: { id: true },
        _sum: {
          timesRetrieved: true,
          timesLmmUsed: true,
        },
        _avg: {
          timesRetrieved: true,
          timesLmmUsed: true,
        },
        _max: {
          timesRetrieved: true,
          timesLmmUsed: true,
        },
      });
      
      return {
        totalDocuments: stats._count.id,
        totalRetrievals: stats._sum.timesRetrieved || 0,
        totalLmmUsage: stats._sum.timesLmmUsed || 0,
        avgRetrievals: stats._avg.timesRetrieved || 0,
        avgLmmUsage: stats._avg.timesLmmUsed || 0,
        maxRetrievals: stats._max.timesRetrieved || 0,
        maxLmmUsage: stats._max.timesLmmUsed || 0,
      };
    } catch (error) {
      console.error("RagDocuments.getStatistics error:", error.message);
      return null;
    }
  },
};

module.exports = { RagDocuments };
