const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  github: (state) => state.user.github,
  email: (state) => state.user.email,
  introduction: (state) => state.user.introduction,
  cachedViews: (state) => state.tagsView.cachedViews
};
export default getters;
