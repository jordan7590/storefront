export const MENUITEMS = [
   {
      path: '/', title: 'Home', type: 'link' 
   },
   {
       path: '/shop/left_sidebar', title: 'Shop', type: 'link'   
   },
   {
      title: 'Pages', type: 'sub', children: [
         {
            title: 'vendor', type: 'sub', tag: 'new', children: [
               { path: '/page/vendor/vendor-dashboard', title: 'Vendor Dashboard', type: 'link' },
               { path: '/page/vendor/vendor-profile', title: 'Vendor Profile', type: 'link' },
               { path: '/page/vendor/become-vendor', title: 'Become Vendor', type: 'link' },
            ]
         },
         {
            title: 'Account', type: 'sub', children: [
               { path: '/page/account/wishlist', title: 'Wishlist', type: 'link' },
               { path: '/page/account/cart', title: 'cart', type: 'link' },
               { path: '/page/account/dashboard', title: 'dashboard', type: 'link' },
               { path: '/page/account/login', title: 'login', type: 'link' },
               { path: '/page/account/login-auth', title: 'login-auth', type: 'link' },
               { path: '/page/account/register', title: 'register', type: 'link' },
               { path: '/page/account/contact', title: 'contact', type: 'link' },
               { path: '/page/account/forget-pwd', title: 'forgot-password', type: 'link' },
               { path: '/page/account/profile', title: 'profile', type: 'link' },
               { path: '/page/account/checkout', title: 'checkout', type: 'link' },
            ]
         },
         { path: '/page/about-us', title: 'about-us', type: 'link' },
         { path: '/page/search', title: 'search', type: 'link' },
         { path: '/page/typography', title: 'typography', type: 'link', tag: 'new' },
         { path: '/page/review', title: 'review', type: 'link' },
         { path: '/page/order-success', title: 'order-success', type: 'link' },
         {
            title: 'compare', type: 'sub', children: [
               { path: '/page/compare', title: 'compare', type: 'link' },
               { path: '/page/compare-2', title: 'compare-2', type: 'link', tag: 'new' }
            ]
         },
         { path: '/page/collection', title: 'collection', type: 'link' },
         { path: '/page/lookbook', title: 'lookbook', type: 'link' },
         { path: '/page/site-map', title: 'site-map', type: 'link' },
         { path: '/page/404', title: '404', type: 'link' },
         { path: '/page/coming-soon', title: 'coming-soon', type: 'link' },
         { path: '/page/faq', title: 'faq', type: 'link' },
      ]
   },
   {
      title: 'Blogs', type: 'sub', children: [
         { path: '/blogs/blog_left_sidebar', title: 'blog left sidebar', type: 'link' },
         { path: '/blogs/blog_right_sidebar', title: 'blog right sidebar', type: 'link' },
         { path: '/blogs/no_sidebar', title: 'no sidebar', type: 'link' },
         { path: '/blogs/blog_detail', title: 'blog detail', type: 'link' },
      ]
   },
   {
      path: '/page/account/contact', title: 'Contact', type: 'link'   
  }
]

