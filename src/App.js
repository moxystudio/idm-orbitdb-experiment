import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import { usePromiseState } from 'react-promiseful';
import { createIpfs, createOrbitDb } from './orbit-db';
import createCounter from './store/counter';
import createKeyValue from './store/keyvalue';
import './App.css';

const orbitdb = createIpfs()
.then((ipfs) => createOrbitDb(ipfs));

const counterStore = orbitdb
.then((orbitdb) => createCounter(orbitdb, 'grandepaulinho11'));

const keyValueStore = orbitdb
.then((orbitdb) => createKeyValue(orbitdb, 'grandepaulinho22'));

const Counter = ({ store }) => {
  const onClick = useCallback(() => store.inc(1), [store]);
  const [value, setValue] = useState(store.value);

  useEffect(() => {
    const handleValueChange = () => setValue(store.value);

    store.events.on('write', handleValueChange);
    store.events.on('replicated', handleValueChange);

    return () => {
      store.events.off('write', handleValueChange);
      store.events.off('replicated', handleValueChange);
    }
  }, [store]);


  return (
    <div>
      <div>Counter: { value }</div>
      <button onClick={ onClick }>Increment</button>
    </div>
  );
}

const KeyValue = ({ store }) => {
  const keyRef = useRef();
  const valueRef = useRef();
  const onClick = useCallback(() => store.put(keyRef.current.value, valueRef.current.value), [store]);
  const [value, setValue] = useState(store.all);

  useEffect(() => {
    const handleValueChange = () => setValue({ ...store.all });

    store.events.on('write', handleValueChange);
    store.events.on('replicated', handleValueChange);

    return () => {
      store.events.off('write', handleValueChange);
      store.events.off('replicated', handleValueChange);
    }
  }, [store]);

  return (
    <div>
      <pre><code>{ JSON.stringify(value, null, 2) }</code></pre>

      Key: <input type="text" ref={ keyRef } />
      Value: <input type="text" ref={ valueRef } />

      <button onClick={ onClick }>Put</button>
    </div>
  );
}

const App = () => {
  const counterStoreState = usePromiseState(counterStore);
  const keyValueStoreState = usePromiseState(keyValueStore);

  if (counterStoreState.status === 'rejected') {
    console.error(counterStoreState.value);
  }

  if (keyValueStoreState.status === 'rejected') {
    console.error(keyValueStoreState.value);
  }

  return (
    <div className="App">
      <Fragment>
        <section>
          <h1>Counter Store</h1>
          { counterStoreState.status === 'pending' && <p>Loading...</p> }
          { counterStoreState.status === 'rejected' && <p>Oops, something went wrong</p> }
          { counterStoreState.status === 'fulfilled' && <Counter store={ counterStoreState.value } /> }
        </section>
        <section>
          <h1>KeyValue Store</h1>
          { keyValueStoreState.status === 'pending' && <p>Loading...</p> }
          { keyValueStoreState.status === 'rejected' && <p>Oops, something went wrong</p> }
          { keyValueStoreState.status === 'fulfilled' && <KeyValue store={ keyValueStoreState.value } /> }
        </section>
      </Fragment>
    </div>
  );
}

export default App;
