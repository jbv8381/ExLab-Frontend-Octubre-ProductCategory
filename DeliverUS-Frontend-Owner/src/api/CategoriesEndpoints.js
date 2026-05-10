import { get, post, put, destroy } from './helpers/ApiRequestsHelper'

function getCategories(id) {
  return get(`/productCategories/restaurants/${id}`)
}

function create(id, data) {
  return post(`/productCategories/restaurants/${id}`, data)
}

function remove(id, id2) {
  return destroy(`/productCategories/${id}/categories/${id2}`)
}

export { getCategories, create, remove }

