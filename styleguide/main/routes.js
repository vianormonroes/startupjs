export default (components = {}) => [
  {
    path: '/',
    exact: true,
    redirect: '/docs'
  },
  {
    path: '/profile',
    exact: true,
    component: components.PProfile
  }
]
