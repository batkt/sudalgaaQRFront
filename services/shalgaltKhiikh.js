import _ from "lodash";
import { parseCookies } from "nookies";
const shalgaltKhiikh = async (ctx, ugudulAvchirya) => {
  try {
    let session = await parseCookies(ctx);
    let data = null;
    if (_.isFunction(ugudulAvchirya)) data = await ugudulAvchirya(ctx, session);
    if (!session.hitoken) throw new Error("aldaa");
    return {
      props: { token: session.hitoken, data },
    };
  } catch (error) {
    ctx.res.writeHead(302, { location: "/" });
    ctx.res.end();
    return { props: {} };
  }
};

export default shalgaltKhiikh;
