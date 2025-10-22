using System.Collections.Generic;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Application.DTOs;

namespace PharmacyApp.Core.Interfaces
{
    public interface IOrderService
    {
        IEnumerable<Order> GetAllOrders();
        Order? GetOrderById(int id);
        Order CreateOrder(OrderRequestDto orderDto);
        void DeleteOrder(int id);
    }
}
