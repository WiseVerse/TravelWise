
using TravelWise.Domain.Interfaces;

namespace StockWise.Bl.Interfaces;

public interface IService<TEntity>: IRepository<TEntity> where TEntity : class;