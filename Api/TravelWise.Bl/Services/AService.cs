using TravelWise.Bl.Interfaces;
using TravelWise.Domain.Interfaces;

namespace TravelWise.Bl.Services;

public abstract class AService<TEntity> : IService<TEntity> where TEntity : class
{
    protected readonly IRepository<TEntity> Repository;

    public AService(IRepository<TEntity> repository)
    {
        Repository = repository;
    }

    public async Task<IEnumerable<TEntity>?> GetAllAsync()
    {
        return await Repository.GetAllAsync();
    }

    public async Task<TEntity?> GetByIdAsync(int id)
    {
        return await Repository.GetByIdAsync(id);
    }

    public async Task<TEntity?> AddAsync(TEntity entity)
    {
        return await Repository.AddAsync(entity);
    }

    public async Task<IEnumerable<TEntity>?> CreateRangeAsync(IEnumerable<TEntity> entities)
    {
        return await Repository.CreateRangeAsync(entities);
    }

    public async Task<TEntity> UpSertAsync(TEntity entity)
    {
        return await Repository.UpSertAsync(entity);
    }

    public async Task<IEnumerable<TEntity>> UpSertRangeAsync(IEnumerable<TEntity> entities)
    {
        return await Repository.UpSertRangeAsync(entities);
    }

    public async Task<TEntity?> DeleteAsyncById(int id)
    {
        return await Repository.DeleteAsyncById(id);
    }

    public async Task<TEntity?> DeleteAsync(TEntity entity)
    {
        return await Repository.DeleteAsync(entity);
    }

    public async Task<IEnumerable<TEntity>?> DeleteRangeAsync(IEnumerable<TEntity> entities)
    {
        return await Repository.DeleteRangeAsync(entities);
    }

    public async Task<IEnumerable<TEntity>?> GetPagedAsync(int page, int pageSize)
    {
        return await Repository.GetPagedAsync(page, pageSize);
    }
}