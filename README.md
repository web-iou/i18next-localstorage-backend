# Getting started


```
# npm package
$ npm install i18next-mmkv-backend
```

Wiring up with the chained backend:

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-mmkv-backend'; // primary use cache
import HttpApi ,{type HttpBackendOptions}from 'i18next-http-backend'; // fallback http load

i18next
        .use(Backend)
        .use(HttpApi)
        .init<HttpBackendOptions>({
          lng: language ?? 'zh-CN',
          load: 'currentOnly',
          fallbackLng: false,
          backend: {
            /* options for primary backend */
            request: async function (_, url, __, callback) {
              const localstorage = new LocalStorageBackend(null,{
                store:new MMKV()
              });
              try {
                const {data} = await request({
                  method: 'get',
                  url,
                });
                localstorage.save(language ?? 'zh-CN', 'translation', data);
                callback(null, {
                  status: 200,
                  data,
                });
              } catch (e) {
                localstorage.read(
                  language ?? 'zh-CN',
                  'translation',
                  (_, data) => {
                    if (data) {
                      callback(null, {
                        status: 200,
                        data: data as string,
                      });
                    } else {
                      Alert.alert('Tip', 'Network is unavailable!');
                      setLoading(false);
                    }
                  },
                );
              }
            },
            loadPath:
              (__DEV__ ? VITE_GEN_PROXY_PATH : void 0) +
              '/admin/trm/web/{{lng}}',
          },
        });
```

## Cache Backend Options


```js
{
  // prefix for stored languages
  prefix: 'i18next_res_',

  // expiration
  expirationTime: 7*24*60*60*1000,

  // Version applied to all languages, can be overriden using the option `versions`
  defaultVersion: '',

  // language versions
  versions: {},
};
```

- Contrary to cookies behavior, the cache will respect updates to `expirationTime`. If you set 7 days and later update to 10 days, the cache will persist for 10 days

- Passing in a `versions` object (ex.: `versions: { en: 'v1.2', fr: 'v1.1' }`) will give you control over the cache based on translations version. This setting works along `expirationTime`, so a cached translation will still expire even though the version did not change. You can still set `expirationTime` far into the future to avoid this

- Passing in a `defaultVersion` string (ex.: `version: 'v1.2'`) will act as if you applied a version to all languages using `versions` option.

