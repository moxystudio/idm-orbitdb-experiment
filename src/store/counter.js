const createCounter = async (orbitdb, name) => {
    // const address = await orbitdb.determineAddress(name, 'counter', {
    //     accessController: {
    //         type: 'orbitdb',
    //         admin: [
    //             '049bf5cfa0d3714c4a161b6a3ca91329c9c5555b033730bd7373e7dfd6c0de2218af57ade461f09ea672dfe0447309e11d26a13b059e766aa665cb591112c829c4',
    //         ],
    //         write: [
    //             '049bf5cfa0d3714c4a161b6a3ca91329c9c5555b033730bd7373e7dfd6c0de2218af57ade461f09ea672dfe0447309e11d26a13b059e766aa665cb591112c829c4',
    //         ],
    //     }
    // });

    // console.log('pubkey', orbitdb.identity);
    // console.log('got address', address.toString());

    const store = await orbitdb.counter(name, {
        create: true,
        accessController: {
            write: ['*'],
        }
    });

    console.log('store', store);

    return new Promise((resolve) => {
        // When a remote peer updated the todos, refresh our data model
		store.events.on('replicated', () => {
            console.log('replicated');
        });

		// Watch for load progress and update the model state with the progress
		store.events.on('load.progress', (address, hash, entry, progress, total) => {
			console.log('load.progress');
        });

        store.events.on('ready', () => {
            console.log('ready');
            resolve(store);
        });

        store.load(1);
    });
};

export default createCounter;
