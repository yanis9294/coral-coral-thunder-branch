import { C as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as Route } from "./_ssr/router-DvyZGEHi.mjs";
import { n as ThesisDetail } from "./_ssr/theses-view-8Ji2zPvI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-TG6DzKWG.js
var import_jsx_runtime = require_jsx_runtime();
function ThesisDetailPage() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThesisDetail, { id });
}
//#endregion
export { ThesisDetailPage as component };
