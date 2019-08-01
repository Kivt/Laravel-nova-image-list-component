Nova.booting((Vue, router, store) => {
    router.addRoutes([
        {
            name: 'image-list',
            path: '/image-list',
            component: require('./components/Tool'),
        },
    ])
})
