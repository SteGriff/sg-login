# Good Notes

\_\_dirname in esmodules:
https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/

Read file content as Promise:
https://remarkablemark.org/blog/2020/12/20/nodejs-fs-readfile-promise/

To figure out how to get Nunjucks to recognise .njk files I read this source code:
`app.set('view engine', engineExt);`
https://github.com/pkolt/express-nunjucks/blob/master/src/index.ts

Nunjucks extend layout:
https://regbrain.com/article/nunjucks-express-app

Doing crypto right - this SO comment:

> In 2022, use crypto.pbkdf2(password, salt, iterations, 128, 'sha256') to generate the hash, and to compare use crypto.timingSafeEqual()

https://stackoverflow.com/questions/17201450/salt-and-hash-password-in-nodejs-w-crypto#comment132017169_17201493

More detail: https://www.passportjs.org/tutorials/password/verify/

Doing auth simply but wrong - this page has bad advice but easily-followed examples of middleware and stuff:

https://www.workfall.com/learning/blog/how-to-perform-a-session-based-user-authentication-in-express-js/
