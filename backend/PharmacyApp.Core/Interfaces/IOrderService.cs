using PharmacyApp.Core.Entities;

namespace PharmacyApp.Core.Interfaces
{
    public interface IOrderService
    {
        IEnumerable<Order> GetAllOrders();
        Order? GetOrderById(int id);
        void CreateOrder(Order order);
        void DeleteOrder(int id);
    }
}
