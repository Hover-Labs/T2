const Store = require('electron-store');
const schema = {
  settings: {
    locale: {
      type: 'string',
      default: 'en-US'
    },
    selectedNode: {
      type: 'string',
      default: ''
    },
    nodesList: {
      type: 'array',
      default: []
    },
    selectedPath: {
      type: 'string',
      default: ''
    },
    pathsList: {
      type: 'array',
      default: []
    }
  },
  wallet: {
    identities: {
      type: 'array',
      default: []
    },
    walletFileName: {
      type: 'string',
      default: ''
    },
    walletLocation: {
      type: 'string',
      default: ''
    },
    password: {
      type: 'string',
      default: ''
    }
  },
  isShowedLanguageScene: {
    type: 'boolean',
    default: false
  },
  isPPAccepted: {
    type: 'boolean',
    default: false
  },
  isNotShowMessage: {
    type: 'boolean',
    default: false
  }
};

const defaultStore = {
  settings: {
    locale: 'en-US',
    selectedNode: '',
    nodesList: [],
    selectedPath: '',
    pathsList: []
  },
  wallet: {
    identities: [],
    walletFileName: '',
    walletLocation: '',
    password: ''
  },
  isShowedLanguageScene: false,
  isPPAccepted: false,
  isNotShowMessage: false
};

const store = new Store({ schema, defaults: defaultStore });

// Set data in store
export function setLocalData(key: string, data: any) {
  store.set(key, data);
}

// Get data in store
export function getLocalData(key: string) {
  return store.get(key);
}

// Remove data in store
export function removeLocalData(key: string) {
  store.delete(key);
}

// reset data in store
export function resetLocalData(key: string) {
  // store.set(key, defaultStore[key]);
  store.set(defaultStore);
}
