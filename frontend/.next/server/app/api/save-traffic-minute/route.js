/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/save-traffic-minute/route";
exports.ids = ["app/api/save-traffic-minute/route"];
exports.modules = {

/***/ "(rsc)/./app/api/save-traffic-minute/route.ts":
/*!**********************************************!*\
  !*** ./app/api/save-traffic-minute/route.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs/promises */ \"fs/promises\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_promises__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nasync function POST(req) {\n    try {\n        const newRecord = await req.json();\n        const dataDir = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"data\");\n        const filePath = path__WEBPACK_IMPORTED_MODULE_2___default().join(dataDir, \"data.json\");\n        // Создаем директорию, если не существует\n        await fs_promises__WEBPACK_IMPORTED_MODULE_1___default().mkdir(dataDir, {\n            recursive: true\n        });\n        let records = [];\n        let nextId = 1;\n        try {\n            // Читаем существующие данные\n            const fileData = await fs_promises__WEBPACK_IMPORTED_MODULE_1___default().readFile(filePath, \"utf8\");\n            if (fileData.trim() !== \"\") {\n                records = JSON.parse(fileData);\n                // Находим максимальный ID для генерации следующего\n                if (records.length > 0) {\n                    nextId = Math.max(...records.map((r)=>r.id)) + 1;\n                }\n            }\n        } catch (error) {\n            console.log(\"Создание нового файла данных\");\n        }\n        // Создаем новую запись с последовательным ID\n        const recordWithId = {\n            id: nextId,\n            ...newRecord\n        };\n        // Добавляем новую запись в массив\n        records.push(recordWithId);\n        // Сохраняем обновленные данные\n        await fs_promises__WEBPACK_IMPORTED_MODULE_1___default().writeFile(filePath, JSON.stringify(records, null, 2));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            newId: nextId,\n            totalRecords: records.length\n        });\n    } catch (error) {\n        console.error(\"Ошибка сохранения данных:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\",\n            details: error instanceof Error ? error.message : String(error)\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NhdmUtdHJhZmZpYy1taW51dGUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTJDO0FBQ2Q7QUFDTDtBQVNqQixlQUFlRyxLQUFLQyxHQUFZO0lBQ3JDLElBQUk7UUFDRixNQUFNQyxZQUFZLE1BQU1ELElBQUlFLElBQUk7UUFDaEMsTUFBTUMsVUFBVUwsZ0RBQVMsQ0FBQ08sUUFBUUMsR0FBRyxJQUFJO1FBQ3pDLE1BQU1DLFdBQVdULGdEQUFTLENBQUNLLFNBQVM7UUFFcEMseUNBQXlDO1FBQ3pDLE1BQU1OLHdEQUFRLENBQUNNLFNBQVM7WUFBRU0sV0FBVztRQUFLO1FBRTFDLElBQUlDLFVBQTJCLEVBQUU7UUFDakMsSUFBSUMsU0FBUztRQUViLElBQUk7WUFDRiw2QkFBNkI7WUFDN0IsTUFBTUMsV0FBVyxNQUFNZiwyREFBVyxDQUFDVSxVQUFVO1lBQzdDLElBQUlLLFNBQVNFLElBQUksT0FBTyxJQUFJO2dCQUMxQkosVUFBVUssS0FBS0MsS0FBSyxDQUFDSjtnQkFFckIsbURBQW1EO2dCQUNuRCxJQUFJRixRQUFRTyxNQUFNLEdBQUcsR0FBRztvQkFDdEJOLFNBQVNPLEtBQUtDLEdBQUcsSUFBSVQsUUFBUVUsR0FBRyxDQUFDLENBQUNDLElBQU1BLEVBQUVDLEVBQUUsS0FBSztnQkFDbkQ7WUFDRjtRQUNGLEVBQUUsT0FBT0MsT0FBTztZQUNkQyxRQUFRQyxHQUFHLENBQUM7UUFDZDtRQUVBLDZDQUE2QztRQUM3QyxNQUFNQyxlQUE4QjtZQUNsQ0osSUFBSVg7WUFDSixHQUFHVixTQUFTO1FBQ2Q7UUFFQSxrQ0FBa0M7UUFDbENTLFFBQVFpQixJQUFJLENBQUNEO1FBRWIsK0JBQStCO1FBQy9CLE1BQU03Qiw0REFBWSxDQUFDVSxVQUFVUSxLQUFLYyxTQUFTLENBQUNuQixTQUFTLE1BQU07UUFFM0QsT0FBT2QscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUN2QjRCLFNBQVM7WUFDVEMsT0FBT3BCO1lBQ1BxQixjQUFjdEIsUUFBUU8sTUFBTTtRQUM5QjtJQUNGLEVBQUUsT0FBT00sT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsNkJBQTZCQTtRQUMzQyxPQUFPM0IscURBQVlBLENBQUNNLElBQUksQ0FDdEI7WUFDRXFCLE9BQU87WUFDUFUsU0FBU1YsaUJBQWlCVyxRQUFRWCxNQUFNWSxPQUFPLEdBQUdDLE9BQU9iO1FBQzNELEdBQ0E7WUFBRWMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xc0JXQstCz0LXQvdC40Y9cXE9uZURyaXZlXFzQoNCw0LHQvtGH0LjQuSDRgdGC0L7Qu1xccHJvamVjdHNcXHRyYWZmaWNfa3Jhc25vZGFyXFxmcm9udGVuZFxcYXBwXFxhcGlcXHNhdmUtdHJhZmZpYy1taW51dGVcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzL3Byb21pc2VzXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG4vLyDQotC40L8g0LTQu9GPINC30LDQv9C40YHQuCDQviDRgtGA0LDRhNC40LrQtVxyXG50eXBlIFRyYWZmaWNSZWNvcmQgPSB7XHJcbiAgZGF0ZTogc3RyaW5nO1xyXG4gIHRpbWU6IHN0cmluZztcclxuICBsZXZlbDogbnVtYmVyO1xyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBSZXF1ZXN0KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IG5ld1JlY29yZCA9IGF3YWl0IHJlcS5qc29uKCk7XHJcbiAgICBjb25zdCBkYXRhRGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIFwiZGF0YVwiKTtcclxuICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGRhdGFEaXIsIFwiZGF0YS5qc29uXCIpO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQtdC8INC00LjRgNC10LrRgtC+0YDQuNGOLCDQtdGB0LvQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCXHJcbiAgICBhd2FpdCBmcy5ta2RpcihkYXRhRGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgICBsZXQgcmVjb3JkczogVHJhZmZpY1JlY29yZFtdID0gW107XHJcbiAgICBsZXQgbmV4dElkID0gMTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyDQp9C40YLQsNC10Lwg0YHRg9GJ0LXRgdGC0LLRg9GO0YnQuNC1INC00LDQvdC90YvQtVxyXG4gICAgICBjb25zdCBmaWxlRGF0YSA9IGF3YWl0IGZzLnJlYWRGaWxlKGZpbGVQYXRoLCBcInV0ZjhcIik7XHJcbiAgICAgIGlmIChmaWxlRGF0YS50cmltKCkgIT09IFwiXCIpIHtcclxuICAgICAgICByZWNvcmRzID0gSlNPTi5wYXJzZShmaWxlRGF0YSk7XHJcblxyXG4gICAgICAgIC8vINCd0LDRhdC+0LTQuNC8INC80LDQutGB0LjQvNCw0LvRjNC90YvQuSBJRCDQtNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INGB0LvQtdC00YPRjtGJ0LXQs9C+XHJcbiAgICAgICAgaWYgKHJlY29yZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbmV4dElkID0gTWF0aC5tYXgoLi4ucmVjb3Jkcy5tYXAoKHIpID0+IHIuaWQpKSArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZyhcItCh0L7Qt9C00LDQvdC40LUg0L3QvtCy0L7Qs9C+INGE0LDQudC70LAg0LTQsNC90L3Ri9GFXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQtdC8INC90L7QstGD0Y4g0LfQsNC/0LjRgdGMINGBINC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3Ri9C8IElEXHJcbiAgICBjb25zdCByZWNvcmRXaXRoSWQ6IFRyYWZmaWNSZWNvcmQgPSB7XHJcbiAgICAgIGlkOiBuZXh0SWQsXHJcbiAgICAgIC4uLm5ld1JlY29yZCxcclxuICAgIH07XHJcblxyXG4gICAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INC90L7QstGD0Y4g0LfQsNC/0LjRgdGMINCyINC80LDRgdGB0LjQslxyXG4gICAgcmVjb3Jkcy5wdXNoKHJlY29yZFdpdGhJZCk7XHJcblxyXG4gICAgLy8g0KHQvtGF0YDQsNC90Y/QtdC8INC+0LHQvdC+0LLQu9C10L3QvdGL0LUg0LTQsNC90L3Ri9C1XHJcbiAgICBhd2FpdCBmcy53cml0ZUZpbGUoZmlsZVBhdGgsIEpTT04uc3RyaW5naWZ5KHJlY29yZHMsIG51bGwsIDIpKTtcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBuZXdJZDogbmV4dElkLFxyXG4gICAgICB0b3RhbFJlY29yZHM6IHJlY29yZHMubGVuZ3RoLFxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCLQntGI0LjQsdC60LAg0YHQvtGF0YDQsNC90LXQvdC40Y8g0LTQsNC90L3Ri9GFOlwiLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHtcclxuICAgICAgICBlcnJvcjogXCJJbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIixcclxuICAgICAgICBkZXRhaWxzOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXHJcbiAgICAgIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImZzIiwicGF0aCIsIlBPU1QiLCJyZXEiLCJuZXdSZWNvcmQiLCJqc29uIiwiZGF0YURpciIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwiZmlsZVBhdGgiLCJta2RpciIsInJlY3Vyc2l2ZSIsInJlY29yZHMiLCJuZXh0SWQiLCJmaWxlRGF0YSIsInJlYWRGaWxlIiwidHJpbSIsIkpTT04iLCJwYXJzZSIsImxlbmd0aCIsIk1hdGgiLCJtYXgiLCJtYXAiLCJyIiwiaWQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJyZWNvcmRXaXRoSWQiLCJwdXNoIiwid3JpdGVGaWxlIiwic3RyaW5naWZ5Iiwic3VjY2VzcyIsIm5ld0lkIiwidG90YWxSZWNvcmRzIiwiZGV0YWlscyIsIkVycm9yIiwibWVzc2FnZSIsIlN0cmluZyIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/save-traffic-minute/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsave-traffic-minute%2Froute&page=%2Fapi%2Fsave-traffic-minute%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsave-traffic-minute%2Froute.ts&appDir=C%3A%5CUsers%5C%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D1%8F%5COneDrive%5C%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB%5Cprojects%5Ctraffic_krasnodar%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5C%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D1%8F%5COneDrive%5C%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB%5Cprojects%5Ctraffic_krasnodar%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsave-traffic-minute%2Froute&page=%2Fapi%2Fsave-traffic-minute%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsave-traffic-minute%2Froute.ts&appDir=C%3A%5CUsers%5C%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D1%8F%5COneDrive%5C%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB%5Cprojects%5Ctraffic_krasnodar%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5C%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D1%8F%5COneDrive%5C%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB%5Cprojects%5Ctraffic_krasnodar%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_OneDrive_projects_traffic_krasnodar_frontend_app_api_save_traffic_minute_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/save-traffic-minute/route.ts */ \"(rsc)/./app/api/save-traffic-minute/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/save-traffic-minute/route\",\n        pathname: \"/api/save-traffic-minute\",\n        filename: \"route\",\n        bundlePath: \"app/api/save-traffic-minute/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Евгения\\\\OneDrive\\\\Рабочий стол\\\\projects\\\\traffic_krasnodar\\\\frontend\\\\app\\\\api\\\\save-traffic-minute\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_OneDrive_projects_traffic_krasnodar_frontend_app_api_save_traffic_minute_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzYXZlLXRyYWZmaWMtbWludXRlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZzYXZlLXRyYWZmaWMtbWludXRlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGc2F2ZS10cmFmZmljLW1pbnV0ZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUMlRDAlOTUlRDAlQjIlRDAlQjMlRDAlQjUlRDAlQkQlRDAlQjglRDElOEYlNUNPbmVEcml2ZSU1QyVEMCVBMCVEMCVCMCVEMCVCMSVEMCVCRSVEMSU4NyVEMCVCOCVEMCVCOSUyMCVEMSU4MSVEMSU4MiVEMCVCRSVEMCVCQiU1Q3Byb2plY3RzJTVDdHJhZmZpY19rcmFzbm9kYXIlNUNmcm9udGVuZCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDJUQwJTk1JUQwJUIyJUQwJUIzJUQwJUI1JUQwJUJEJUQwJUI4JUQxJThGJTVDT25lRHJpdmUlNUMlRDAlQTAlRDAlQjAlRDAlQjElRDAlQkUlRDElODclRDAlQjglRDAlQjklMjAlRDElODElRDElODIlRDAlQkUlRDAlQkIlNUNwcm9qZWN0cyU1Q3RyYWZmaWNfa3Jhc25vZGFyJTVDZnJvbnRlbmQmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzBFO0FBQ3ZKO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFzQldCy0LPQtdC90LjRj1xcXFxPbmVEcml2ZVxcXFzQoNCw0LHQvtGH0LjQuSDRgdGC0L7Qu1xcXFxwcm9qZWN0c1xcXFx0cmFmZmljX2tyYXNub2RhclxcXFxmcm9udGVuZFxcXFxhcHBcXFxcYXBpXFxcXHNhdmUtdHJhZmZpYy1taW51dGVcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3NhdmUtdHJhZmZpYy1taW51dGUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9zYXZlLXRyYWZmaWMtbWludXRlXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9zYXZlLXRyYWZmaWMtbWludXRlL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxc0JXQstCz0LXQvdC40Y9cXFxcT25lRHJpdmVcXFxc0KDQsNCx0L7Rh9C40Lkg0YHRgtC+0LtcXFxccHJvamVjdHNcXFxcdHJhZmZpY19rcmFzbm9kYXJcXFxcZnJvbnRlbmRcXFxcYXBwXFxcXGFwaVxcXFxzYXZlLXRyYWZmaWMtbWludXRlXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsave-traffic-minute%2Froute&page=%2Fapi%2Fsave-traffic-minute%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsave-traffic-minute%2Froute.ts&appDir=C%3A%5CUsers%5C%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D1%8F%5COneDrive%5C%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB%5Cprojects%5Ctraffic_krasnodar%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5C%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D1%8F%5COneDrive%5C%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB%5Cprojects%5Ctraffic_krasnodar%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsave-traffic-minute%2Froute&page=%2Fapi%2Fsave-traffic-minute%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsave-traffic-minute%2Froute.ts&appDir=C%3A%5CUsers%5C%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D1%8F%5COneDrive%5C%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB%5Cprojects%5Ctraffic_krasnodar%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5C%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D1%8F%5COneDrive%5C%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB%5Cprojects%5Ctraffic_krasnodar%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();