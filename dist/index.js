"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePageView = exports.Analytics = void 0;
const analytics_1 = __importDefault(require("@/lib/analytics"));
exports.Analytics = analytics_1.default;
const useAnalytics_1 = __importDefault(require("@/hooks/useAnalytics"));
exports.usePageView = useAnalytics_1.default;
exports.default = analytics_1.default;
//# sourceMappingURL=index.js.map