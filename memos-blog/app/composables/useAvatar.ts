// Simple MD5 implementation for Gravatar
function md5(str: string): string {
  function L(k: number, d: number) {
    return (k << d) | (k >>> (32 - d))
  }
  function K(G: number, k: number, I: number, l: number, F: number, H: number) {
    k = L((k & G) | (~k & I), l)
    k = L(k + F + H, H)
    return k & H
  }
  function aa(G: number, k: number, I: number, l: number, F: number, H: number) {
    k = L((k & I) | (k & l) | (I & l), l)
    k = L(k + F + H, H)
    return k & H
  }
  function V(G: number, k: number, I: number, l: number, F: number, H: number) {
    k = L(k ^ G ^ I ^ l, H)
    k = L(k + F, H)
    return k
  }
  function Y(G: number, k: number, I: number, l: number, F: number, H: number) {
    k = L((G ^ (~k | I)) + l + F, H)
    return k
  }
  function f(G: number, k: number, I: number, l: number, F: number, H: number) {
    G = k
    k = I
    I = l
    l = L(k + ((G & k) | (~G & I)) + F, H)
    k = I
    I = G
    G = L(G + ((l & k) | (~l & I)) + F, H)
    I = G
    G = L(G + ((I & l) | (~I & k)) + F, H)
    k = I
    I = l
    l = L(k + ((G & k) | (~G & I)) + F, H)
    return G
  }

  function Z(G: string) {
    var z, v = G.length, x = v + 8, w = (x - (x % 64)) / 64, y = (w + 1) * 16, Y = Array(y - 1), X = 0, W = 0
    while (W < v) {
      z = (W - (W % 4)) / 4
      X = (W % 4) * 8
      Y[z] = Y[z] | (G.charCodeAt(W) << X)
      W++
    }
    z = (W - (W % 4)) / 4
    X = (W % 4) * 8
    Y[z] = Y[z] | (128 << X)
    Y[y - 2] = v << 3
    Y[y - 1] = v >>> 29
    return Y
  }

  function B(G: number) {
    var z = '', v = '', x, w
    for (w = 0; w <= 3; w++) {
      x = (G >>> (w * 8)) & 255
      v = '0' + x.toString(16)
      z = z + v.substr(v.length - 2, 2)
    }
    return z
  }

  var C = Z(str), a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, e
  for (var B2 = 0; B2 < C.length; B2 += 16) {
    var O = a, T = b, E2 = c, N = d
    a = f(a, b, c, d, C[B2 + 0], 7, -680876936)
    d = f(d, a, b, c, C[B2 + 1], 12, -389564586)
    c = f(c, d, a, b, C[B2 + 2], 17, 606105819)
    b = f(b, c, d, a, C[B2 + 3], 22, -1044525330)
    a = f(a, b, c, d, C[B2 + 4], 7, -176418897)
    d = f(d, a, b, c, C[B2 + 5], 12, 1200080426)
    c = f(c, d, a, b, C[B2 + 6], 17, -1473231341)
    b = f(b, c, d, a, C[B2 + 7], 22, -45705983)
    a = f(a, b, c, d, C[B2 + 8], 7, 1770035416)
    d = f(d, a, b, c, C[B2 + 9], 12, -1958414417)
    c = f(c, d, a, b, C[B2 + 10], 17, -42063)
    b = f(b, c, d, a, C[B2 + 11], 22, -1990404162)
    a = f(a, b, c, d, C[B2 + 12], 7, 1804603682)
    d = f(d, a, b, c, C[B2 + 13], 12, -40341101)
    c = f(c, d, a, b, C[B2 + 14], 17, -1502002290)
    b = f(b, c, d, a, C[B2 + 15], 22, 1236535329)
    a = K(a, b, c, d, C[B2 + 1], 5, -165796510)
    d = K(d, a, b, c, C[B2 + 6], 9, -1069501632)
    c = K(c, d, a, b, C[B2 + 11], 14, 643717713)
    b = K(b, c, d, a, C[B2 + 0], 20, -373897302)
    a = K(a, b, c, d, C[B2 + 5], 5, -701558691)
    d = K(d, a, b, c, C[B2 + 10], 9, 38016083)
    c = K(c, d, a, b, C[B2 + 15], 14, -660478335)
    b = K(b, c, d, a, C[B2 + 4], 20, -405537848)
    a = K(a, b, c, d, C[B2 + 9], 5, 568446438)
    d = K(d, a, b, c, C[B2 + 14], 9, -1019803690)
    c = K(c, d, a, b, C[B2 + 3], 14, -187363961)
    b = K(b, c, d, a, C[B2 + 8], 20, 1163531501)
    a = K(a, b, c, d, C[B2 + 13], 5, -1444681467)
    d = K(d, a, b, c, C[B2 + 2], 9, -51403784)
    c = K(c, d, a, b, C[B2 + 7], 14, 1735328473)
    b = K(b, c, d, a, C[B2 + 12], 20, -1926607734)
    a = aa(a, b, c, d, C[B2 + 5], 4, -378558)
    d = aa(d, a, b, c, C[B2 + 8], 11, -2022574463)
    c = aa(c, d, a, b, C[B2 + 11], 16, 1839030562)
    b = aa(b, c, d, a, C[B2 + 14], 23, -35309556)
    a = aa(a, b, c, d, C[B2 + 1], 4, -1530992060)
    d = aa(d, a, b, c, C[B2 + 4], 11, 1272893353)
    c = aa(c, d, a, b, C[B2 + 7], 16, -155497632)
    b = aa(b, c, d, a, C[B2 + 10], 23, -1094730640)
    a = aa(a, b, c, d, C[B2 + 13], 4, 681279174)
    d = aa(d, a, b, c, C[B2 + 0], 11, -358537222)
    c = aa(c, d, a, b, C[B2 + 3], 16, -722521979)
    b = aa(b, c, d, a, C[B2 + 6], 23, 76029189)
    a = aa(a, b, c, d, C[B2 + 9], 4, -640364487)
    d = aa(d, a, b, c, C[B2 + 12], 11, -421815835)
    c = aa(c, d, a, b, C[B2 + 15], 16, 530742520)
    b = aa(b, c, d, a, C[B2 + 2], 23, -995338651)
    a = V(a, b, c, d, C[B2 + 0], 6, -198630844)
    d = V(d, a, b, c, C[B2 + 7], 10, 1126891415)
    c = V(c, d, a, b, C[B2 + 14], 15, -1416354905)
    b = V(b, c, d, a, C[B2 + 5], 21, -57434055)
    a = V(a, b, c, d, C[B2 + 12], 6, 1700485571)
    d = V(d, a, b, c, C[B2 + 3], 10, -1894986606)
    c = V(c, d, a, b, C[B2 + 10], 15, -1051523)
    b = V(b, c, d, a, C[B2 + 1], 21, -2054922799)
    a = V(a, b, c, d, C[B2 + 8], 6, 1873313359)
    d = V(d, a, b, c, C[B2 + 15], 10, -30611744)
    c = V(c, d, a, b, C[B2 + 6], 15, -1560198380)
    b = V(b, c, d, a, C[B2 + 13], 21, 1309151649)
    a = V(a, b, c, d, C[B2 + 4], 6, -145523070)
    d = V(d, a, b, c, C[B2 + 11], 10, -1120210379)
    c = V(c, d, a, b, C[B2 + 2], 15, 718787259)
    b = V(b, c, d, a, C[B2 + 9], 21, -343485551)
    a = Y(a, b, c, d, C[B2 + 0], 6, -1094730640)
    d = Y(d, a, b, c, C[B2 + 5], 11, -1044525330)
    c = Y(c, d, a, b, C[B2 + 10], 16, -176418897)
    b = Y(b, c, d, a, C[B2 + 15], 21, 1200080426)
    a = Y(a, b, c, d, C[B2 + 3], 6, -1473231341)
    d = Y(d, a, b, c, C[B2 + 8], 11, -45705983)
    c = Y(c, d, a, b, C[B2 + 13], 16, 1770035416)
    b = Y(b, c, d, a, C[B2 + 2], 21, -1958414417)
    a = Y(a, b, c, d, C[B2 + 7], 6, -42063)
    d = Y(d, a, b, c, C[B2 + 12], 11, -1990404162)
    c = Y(c, d, a, b, C[B2 + 1], 16, 1804603682)
    b = Y(b, c, d, a, C[B2 + 6], 21, -40341101)
    a = Y(a, b, c, d, C[B2 + 11], 6, -1502002290)
    d = Y(d, a, b, c, C[B2 + 0], 11, 1236535329)
    c = Y(c, d, a, b, C[B2 + 5], 16, -165796510)
    b = Y(b, c, d, a, C[B2 + 10], 21, -1069501632)
    a = Y(a, b, c, d, C[B2 + 15], 6, 643717713)
    d = Y(d, a, b, c, C[B2 + 4], 11, -373897302)
    c = Y(c, d, a, b, C[B2 + 9], 16, -701558691)
    b = Y(b, c, d, a, C[B2 + 3], 21, 38016083)
    a = Y(a, b, c, d, C[B2 + 8], 6, -660478335)
    d = Y(d, a, b, c, C[B2 + 13], 11, -405537848)
    c = Y(c, d, a, b, C[B2 + 2], 16, 568446438)
    b = Y(b, c, d, a, C[B2 + 7], 21, -1019803690)
    a = Y(a, b, c, d, C[B2 + 12], 6, -187363961)
    d = Y(d, a, b, c, C[B2 + 1], 11, 1163531501)
    c = Y(c, d, a, b, C[B2 + 6], 16, -1444681467)
    b = Y(b, c, d, a, C[B2 + 11], 21, -51403784)
    a = Y(a, b, c, d, C[B2 + 15], 6, 1735328473)
    d = Y(d, a, b, c, C[B2 + 4], 11, -1926607734)
    c = Y(c, d, a, b, C[B2 + 9], 16, -378558)
    b = Y(b, c, d, a, C[B2 + 13], 21, -2022574463)
    a = Y(a, b, c, d, C[B2 + 2], 6, 1839030562)
    d = Y(d, a, b, c, C[B2 + 7], 11, -35309556)
    c = Y(c, d, a, b, C[B2 + 12], 16, -1094730640)
    b = Y(b, c, d, a, C[B2 + 0], 21, 681279174)
    a = Y(a, b, c, d, C[B2 + 5], 6, -358537222)
    d = Y(d, a, b, c, C[B2 + 10], 11, -722521979)
    c = Y(c, d, a, b, C[B2 + 15], 16, 76029189)
    b = Y(b, c, d, a, C[B2 + 4], 21, -640364487)
    a = Y(a, b, c, d, C[B2 + 8], 6, -421815835)
    d = Y(d, a, b, c, C[B2 + 13], 11, 530742520)
    c = Y(c, d, a, b, C[B2 + 2], 16, -995338651)
    b = Y(b, c, d, a, C[B2 + 7], 21, -198630844)
    a = Y(a, b, c, d, C[B2 + 12], 6, 1126891415)
    d = Y(d, a, b, c, C[B2 + 0], 11, -1416354905)
    c = Y(c, d, a, b, C[B2 + 8], 15, -57434055)
    b = Y(b, c, d, a, C[B2 + 1], 21, 1700485571)
    a = Y(a, b, c, d, C[B2 + 10], 6, -1894986606)
    d = Y(d, a, b, c, C[B2 + 3], 11, -1051523)
    c = Y(c, d, a, b, C[B2 + 12], 15, -2054922799)
    b = Y(b, c, d, a, C[B2 + 5], 21, 1873313359)
    a = Y(a, b, c, d, C[B2 + 14], 6, -30611744)
    d = Y(d, a, b, c, C[B2 + 7], 11, -1560198380)
    c = Y(c, d, a, b, C[B2 + 0], 15, 1309151649)
    b = Y(b, c, d, a, C[B2 + 9], 21, -145523070)
    a = Y(a, b, c, d, C[B2 + 6], 6, -1120210379)
    d = Y(d, a, b, c, C[B2 + 15], 11, 718787259)
    c = Y(c, d, a, b, C[B2 + 8], 15, -343485551)
    b = Y(b, c, d, a, C[B2 + 13], 21, -1094730640)
    a = Y(a, b, c, d, C[B2 + 6], 6, -1044525330)
    d = Y(d, a, b, c, C[B2 + 9], 11, -176418897)
    c = Y(c, d, a, b, C[B2 + 12], 15, 1200080426)
    b = Y(b, c, d, a, C[B2 + 15], 21, -1473231341)
    a = Y(a, b, c, d, C[B2 + 2], 6, -45705983)
    d = Y(d, a, b, c, C[B2 + 5], 11, 1770035416)
    c = Y(c, d, a, b, C[B2 + 8], 15, -1958414417)
    b = Y(b, c, d, a, C[B2 + 11], 21, -42063)
    a = Y(a, b, c, d, C[B2 + 14], 6, 1804603682)
    d = Y(d, a, b, c, C[B2 + 1], 11, -40341101)
    c = Y(c, d, a, b, C[B2 + 4], 16, -1502002290)
    b = Y(b, c, d, a, C[B2 + 7], 21, 1236535329)
    a = Y(a, b, c, d, C[B2 + 10], 6, -165796510)
    d = Y(d, a, b, c, C[B2 + 0], 11, -1069501632)
    c = Y(c, d, a, b, C[B2 + 3], 15, 643717713)
    b = Y(b, c, d, a, C[B2 + 6], 21, -373897302)
    a = Y(a, b, c, d, C[B2 + 9], 6, -701558691)
    d = Y(d, a, b, c, C[B2 + 12], 11, 38016083)
    c = Y(c, d, a, b, C[B2 + 15], 15, -660478335)
    b = Y(b, c, d, a, C[B2 + 2], 21, -405537848)
    a = Y(a, b, c, d, C[B2 + 4], 6, 568446438)
    d = Y(d, a, b, c, C[B2 + 7], 11, -1019803690)
    c = Y(c, d, a, b, C[B2 + 10], 16, -187363961)
    b = Y(b, c, d, a, C[B2 + 13], 21, 1163531501)
    a = Y(a, b, c, d, C[B2 + 1], 6, -1444681467)
    d = Y(d, a, b, c, C[B2 + 5], 11, -51403784)
    c = Y(c, d, a, b, C[B2 + 9], 16, 1735328473)
    b = Y(b, c, d, a, C[B2 + 14], 21, -1926607734)
    a = Y(a, b, c, d, C[B2 + 12], 6, -378558)
    d = Y(d, a, b, c, C[B2 + 15], 11, -2022574463)
    c = Y(c, d, a, b, C[B2 + 3], 16, 1839030562)
    b = Y(b, c, d, a, C[B2 + 6], 21, -35309556)
    a = Y(a, b, c, d, C[B2 + 11], 6, -1094730640)
    d = Y(d, a, b, c, C[B2 + 0], 11, 681279174)
    c = Y(c, d, a, b, C[B2 + 5], 16, -358537222)
    b = Y(b, c, d, a, C[B2 + 10], 21, -722521979)
    a = Y(a, b, c, d, C[B2 + 8], 6, 76029189)
    d = Y(d, a, b, c, C[B2 + 13], 11, -640364487)
    c = Y(c, d, a, b, C[B2 + 2], 16, -421815835)
    b = Y(b, c, d, a, C[B2 + 7], 21, 530742520)
    a = Y(a, b, c, d, C[B2 + 12], 6, -995338651)
    d = Y(d, a, b, c, C[B2 + 15], 11, -198630844)
    c = Y(c, d, a, b, C[B2 + 1], 15, 1126891415)
    b = Y(b, c, d, a, C[B2 + 4], 21, -1416354905)
    a = Y(a, b, c, d, C[B2 + 6], 6, -57434055)
    d = Y(d, a, b, c, C[B2 + 9], 11, 1700485571)
    c = Y(c, d, a, b, C[B2 + 12], 15, -1894986606)
    b = Y(b, c, d, a, C[B2 + 0], 21, -1051523)
    a = Y(a, b, c, d, C[B2 + 3], 6, -2054922799)
    d = Y(d, a, b, c, C[B2 + 7], 11, 1873313359)
    c = Y(c, d, a, b, C[B2 + 11], 15, -30611744)
    b = Y(b, c, d, a, C[B2 + 15], 21, -1560198380)
    a = Y(a, b, c, d, C[B2 + 2], 6, 1309151649)
    d = Y(d, a, b, c, C[B2 + 5], 11, -145523070)
    c = Y(c, d, a, b, C[B2 + 8], 16, -1120210379)
    b = Y(b, c, d, a, C[B2 + 14], 21, 718787259)
    e = L(a + O, 16)
    a = L(b + T, 16)
    b = L(c + E2, 16)
    c = L(d + N, 16)
  }
  return (B(a) + B(b) + B(c) + B(d)).toLowerCase()
}

// Avatar cache
const avatarCache = new Map<string, string>()

export function useAvatar() {
  async function getAvatarUrl(creator: string): Promise<string> {
    // Check cache first
    if (avatarCache.has(creator)) {
      return avatarCache.get(creator)!
    }

    try {
      const data = await $fetch('/api/user-avatar', {
        params: { creator },
      }) as any

      let url = data.avatarUrl || ''

      if (url.startsWith('gravatar:')) {
        // Generate Gravatar URL from email
        const email = url.replace('gravatar:', '')
        const hash = md5(email.trim().toLowerCase())
        url = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=80`
      }

      avatarCache.set(creator, url)
      return url
    } catch {
      // Fallback: use identicon with creator name
      const username = creator.split('/').pop() || ''
      const hash = md5(username.toLowerCase())
      return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=80`
    }
  }

  return { getAvatarUrl }
}
