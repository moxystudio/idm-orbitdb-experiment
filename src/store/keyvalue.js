const createKeyValue = async (orbitdb, name) => {
    // const address = await orbitdb.determineAddress(name, 'keyvalue', {
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

    const store = await orbitdb.keyvalue(name, {
        create: true,
        accessController: {
            write: ['*'],
        }
    });

    return new Promise((resolve) => {
        // When a remote peer updated the todos, refresh our data model
		store.events.on('replicated', () => {
            console.log('replicated');
        });

		// Watch for load progress and update the model state with the progress
		store.events.on('load.progress', (address, hash, entry, progress, total) => {
			console.log('load.progress');
        });

        store.events.on('write', () => {
            console.log('write');
        });

        store.events.on('ready', () => {
            console.log('ready');
            resolve(store);
        });

        store.load();
    });
};

export default createKeyValue;
