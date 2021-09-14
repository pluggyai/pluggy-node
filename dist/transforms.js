"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPageResponse = exports.transformTransaction = exports.transformItem = exports.transformInvestment = exports.transformIdentity = exports.transformAccount = void 0;
// these functions works very similar to React/Redux Reducers, it transform a remote response to a typed object instances
function transformAccount(account) {
    return Object.assign(Object.assign({}, account), { creditData: account.creditData && Object.assign(Object.assign({}, account.creditData), { balanceCloseDate: account.creditData.balanceCloseDate && new Date(account.creditData.balanceCloseDate), balanceDueDate: account.creditData.balanceDueDate && new Date(account.creditData.balanceDueDate) }) });
}
exports.transformAccount = transformAccount;
function transformIdentity(identity) {
    return Object.assign(Object.assign({}, identity), { birthDate: identity.birthDate && new Date(identity.birthDate) });
}
exports.transformIdentity = transformIdentity;
function transformInvestment(investment) {
    return Object.assign(Object.assign({}, investment), { date: investment.date && new Date(investment.date), dueDate: investment.dueDate && new Date(investment.dueDate), issueDate: investment.issueDate && new Date(investment.issueDate), transactions: investment.transactions.map(transaction => (Object.assign(Object.assign({}, transaction), { date: new Date(transaction.date), tradeDate: new Date(transaction.tradeDate) }))) });
}
exports.transformInvestment = transformInvestment;
function transformItem(item) {
    return Object.assign(Object.assign({}, item), { createdAt: new Date(item.createdAt), lastUpdatedAt: item.lastUpdatedAt && new Date(item.lastUpdatedAt) });
}
exports.transformItem = transformItem;
function transformTransaction(transaction) {
    return Object.assign(Object.assign({}, transaction), { date: new Date(transaction.date) });
}
exports.transformTransaction = transformTransaction;
function transformPageResponse(transformCb) {
    const finalTransform = (response) => (Object.assign(Object.assign({}, response), { results: response.results.map(transformCb) }));
    return finalTransform;
}
exports.transformPageResponse = transformPageResponse;
