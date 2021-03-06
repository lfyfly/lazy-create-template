const router = require('koa-router')()
const User = require('./User')
const { findByPage, successRes, filterObjectBlankKey } = require('../utils')
const { required } = require('../validators')

router.prefix('/user')

router.post('/create', async function (ctx) {
  const { name } = ctx.request.body

  await User.create({ name })

  ctx.body = successRes({}, '创建成功')
})

router.get('/list', async function (ctx) {
  const { page = 1, limit = 10, name, status, id } = ctx.request.query
  const filter = filterObjectBlankKey({
    _id: id,
    name: name ? new RegExp(name) : undefined,
    status: Number(status)
  })

  const data = await findByPage(User, { page: Number(page), limit: Number(limit) }, [
    filter,
    'name status'
  ])

  ctx.body = successRes(data)
})

router.get('/detail', async function (ctx) {
  const { id } = ctx.request.query
  const data = User.findOne({ _id: id })

  if(!data) throw new Error('该数据不存在')

  ctx.body = successRes(data)
})

router.post('/update', async function (ctx) {
  const { id, name, status } = ctx.request.body

  const res = await User.updateOne({ _id: id }, { name, status }, { runValidators: true })

  if (!res.nModified) throw new Error('该数据不存在')

  ctx.body = successRes({}, '更新成功')
})

router.post('/delete', async function (ctx) {
  const { id } = ctx.request.body

  required(id, 'id')

  // 删除关联，比如这里删除Article关联的tags
  // await Article.updateMany({ tags: id }, { $pull: { tags: id } })

  const res = await User.updateOne({ _id: id }, { isDelete: true })
  if (!res.nModified) throw new Error('该数据不存在')

  ctx.body = successRes({}, '删除成功')
})



// router.post('/check-import', async function (ctx) {
//   const { id } = ctx.request.body

//   required(id, 'id')

//   const hasImport = !!(await Article.findOne({ tags: id }))

//   // "该标签已经被文章所引用，如果删除则文章的引用全部解除"
//   ctx.body = successRes({ hasImport })
// })

module.exports = router