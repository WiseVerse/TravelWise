
using TravelWise.Domain.Interfaces;

namespace TravelWise.Bl.Interfaces;

public interface IService<TEntity>: IRepository<TEntity> where TEntity : class;