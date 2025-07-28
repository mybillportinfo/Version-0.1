// Bills Service - Business logic for bill management
import { apiRequest } from '../client/src/lib/queryClient';

export class BillsService {
  // Get all bills for the current user
  static async getAllBills() {
    try {
      const response = await fetch('/api/bills');
      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
  }

  // Pay a specific bill
  static async payBill(billId) {
    try {
      const response = await apiRequest(`/api/bills/${billId}/pay`, {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Error paying bill:', error);
      throw error;
    }
  }

  // Get bills by priority
  static async getBillsByPriority(priority) {
    try {
      const bills = await this.getAllBills();
      return bills.filter(bill => bill.priority === priority);
    } catch (error) {
      console.error('Error filtering bills by priority:', error);
      throw error;
    }
  }

  // Get overdue bills
  static async getOverdueBills() {
    try {
      const bills = await this.getAllBills();
      const today = new Date();
      return bills.filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return dueDate < today && bill.status !== 'paid';
      });
    } catch (error) {
      console.error('Error getting overdue bills:', error);
      throw error;
    }
  }

  // Get upcoming bills (due within next 7 days)
  static async getUpcomingBills() {
    try {
      const bills = await this.getAllBills();
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return bills.filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return dueDate >= today && dueDate <= nextWeek && bill.status !== 'paid';
      });
    } catch (error) {
      console.error('Error getting upcoming bills:', error);
      throw error;
    }
  }

  // Calculate total outstanding amount
  static async getTotalOutstanding() {
    try {
      const bills = await this.getAllBills();
      return bills
        .filter(bill => bill.status !== 'paid')
        .reduce((total, bill) => total + parseFloat(bill.amount), 0);
    } catch (error) {
      console.error('Error calculating total outstanding:', error);
      throw error;
    }
  }

  // Pay all bills
  static async payAllBills() {
    try {
      const bills = await this.getAllBills();
      const unpaidBills = bills.filter(bill => bill.status !== 'paid');
      
      const paymentPromises = unpaidBills.map(bill => 
        this.payBill(bill.id)
      );
      
      const results = await Promise.allSettled(paymentPromises);
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return {
        total: unpaidBills.length,
        successful,
        failed,
        results
      };
    } catch (error) {
      console.error('Error paying all bills:', error);
      throw error;
    }
  }

  // Get bill statistics
  static async getBillStats() {
    try {
      const bills = await this.getAllBills();
      const totalBills = bills.length;
      const paidBills = bills.filter(bill => bill.status === 'paid').length;
      const pendingBills = totalBills - paidBills;
      const totalAmount = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
      const paidAmount = bills
        .filter(bill => bill.status === 'paid')
        .reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
      const outstandingAmount = totalAmount - paidAmount;

      return {
        totalBills,
        paidBills,
        pendingBills,
        totalAmount,
        paidAmount,
        outstandingAmount,
        paymentRate: totalBills > 0 ? (paidBills / totalBills * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error('Error getting bill statistics:', error);
      throw error;
    }
  }
}

export default BillsService;