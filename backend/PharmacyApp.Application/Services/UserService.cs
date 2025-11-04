using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PharmacyApp.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
            return user;
        }
    }
}
