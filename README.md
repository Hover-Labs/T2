# T2

A wallet for the Tezos blockchain based on [ConseilJS](https://github.com/Cryptonomic/ConseilJS). T2 is a rewrite of the original Tezori codebase into Typescript. Along the way we rearchitected to code to make it more resilient and extensible. The wallet uses ConseilJS to interact with the Tezos blockchain for operation submission and with the Conseil indexer for fast aggregated data, like the full list of transactions for an account, or the collection of contracts a given account has deployed. ConseilJS also provides a software signer and a Ledger device interface for increased security.

This product was written for the community – fork it, hack it, use it as you please!

[![Build Status](https://travis-ci.org/Cryptonomic/Tezori.svg?branch=master)](https://travis-ci.org/Cryptonomic/Tezori)
[![Coverage Status](https://coveralls.io/repos/github/Cryptonomic/Tezori/badge.svg?branch=master)](https://coveralls.io/github/Cryptonomic/Tezori?branch=master)

## Development

### Building

The wallet is built with Typescript, React and Electron. The production deployment lives as [Galleon Wallet](https://cryptonomic.tech/galleon.html) from [Cryptonomic](https://cryptonomic.tech/).

To build your own package add the environment configuration file as `src/extraResources/walletSettings.json`. Cryptonomic uses the [Nautilus Cloud](https://nautilus.cloud/) infrastructure of Tezos and [Conseil indexer](https://github.com/Cryptonomic/Conseil) nodes for production deployments.

```json
{
  "selectedNode": "MyTezosNode",
  "nodesList": [
    {
      "displayName": "MyTezosNode",
      "platform": "TEZOS",
      "network": "MyNetwork",
      "tezosUrl": "https://mytezosnode.com",
      "conseilUrl": "https://myconseilnode.com",
      "apiKey": "anapikey"
    }
  ],
  "selectedPath": "Default",
  "pathsList": [
    {
      "label": "Default",
      "derivation": "44'/1729'/0'/0'/0'"
    }
  ]
}
```

To install all dependencies:

```bash
npm i
cd src
npm i
cd ..
```

To run during development:

`npm run dev`

To package for deployment for the local target:

`npm run package`

### Customization Options

Several branding features can be applied in `src/config.json`, including name, logo and block explorer link.

### Contributing

We welcome all contributions, be it issue reports, feature suggestions, [language files]() or pull requests. When submitting a PR expect the code to undergo a detailed review prior to any potential inclusion.

## Support

Cryptonomic hosts a [developer support channel]() on Riot. There is a Telegram chat for [Galleon user support](). Cryptonomic and several of its employees are active on Reddit and Twitter.

[ConseilJS documentation]() and [Conseil documentation]() is quite through as well.

## Architecture Overview

_This section may be occasionally outdated as the codebase evolves._

One of the goals for the T2 rewrite of Tezori was to organize the code in a clearer way. Here's an outline of the directory structure.

- `components` – Reusable components, these are customized React and material-ui elements that perform common functions, like [value entry](NumericEntry).
- constants
- `containers` – Application views, compositions of components for the primary application window.
- `contracts` – Contract-specific interfaces. These components are meant to be isolated if necessary, especially early in the development cycle to reduce the impact of new functionality on the existing application.
- customHooks
- `extraResources` - Contains wallet settings.
- `featureModals` – Functional pop-up that contain significant interactive functionality like [deploying contracts]() and signing messages.
- `locales` – language files.
- `reduxContent` – actions, thunks, reducers, and various other Redux conventional bits to manage state and hook up application events.
- store
- styles
- types
- utils

The main application entry point is `app.html`.

## Known Issues

There are several opportunities for improvement that we're tackling during the normal process of adding new functionality to the application. There include, but are not limited to:

- Documentation
- Removing duplicate code & components.
- Removing duplicate styles.
- Reducing direct dependencies.
- Consolidating like utilities.

There are `TODO` items sprinkled around the code and of course the formal [list of issues]().
