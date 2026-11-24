// ✅ Get Cookie
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}

// ✅ Set Cookie
export function setCookie(name, value, options = {}) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/`;

  // if (options.days !== undefined) {
  //   cookie += `; Max-Age=${options.days * 24 * 60 * 60}`;
  // }

  if (options.hours !== undefined) {
    const maxAge = options.hours * 60 * 60; // seconds
    cookie += `; Max-Age=${maxAge}`;
  }


  if (options.secure) cookie += "; Secure";
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

  document.cookie = cookie;
}


// ✅ Delete Cookie
export function deleteCookie(name) {
  // document.cookie = `${name}=; Max-Age=0; Path=/; Domain=example.com`;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
}