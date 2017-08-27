# webpack-project
*基于webpack前端工程化打包，兼容IE8

由于公司目前项目是前后端没有分离状态，前端提供静态模板，后端人员将其改为jsp页面进行渲染。考虑到后面的项目重构，和新项目开发，故用webpack搭建一个多页面模块化前端工程，实现前后端分离，并采用最新的前端技术，兼容到IE8。前端技术用es6+sass+jq+boootstrap,nodejs+express提供本地服务器环境，http-proxy-middleware提供接口代理转发，webpack-hot-middleware实现自动打包热刷新功能方便本地开发。
