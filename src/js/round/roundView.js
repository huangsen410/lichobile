var chessground = require('chessground');
var clock = require('./clock');
var renderPromotion = require('./promotion').view;
var utils = require('../utils');
var i18n = require('../i18n');
var replayView = require('./replay/replayView');

function ratingDiff(player) {
  if (typeof player.ratingDiff === 'undefined') return null;
  if (player.ratingDiff === 0) return m('span.rp.null', 0);
  if (player.ratingDiff > 0) return m('span.rp.up', '+' + player.ratingDiff);
  if (player.ratingDiff < 0) return m('span.rp.down', player.ratingDiff);
}

function renderUser(ctrl, player) {
  return player.user ? (
    (player.user.title ? player.user.title + ' ' : '') + player.user.username
  ) : 'Anonymous';
}

function renderMaterial(ctrl, color) {
  var material = chessground.board.getMaterialDiff(ctrl.chessground.data)[color];
  var children = [];
  for (var role in material) {
    var piece = m('div.' + role);
    var count = material[role];
    var content;
    if (count === 1) content = piece;
    else {
      content = [];
      for (var i = 0; i < count; i++) content.push(piece);
    }
    children.push(m('div.tomb', content));
  }
  return m('div.material', children);
}

function renderAntagonist(ctrl, player) {
  return m('section.antagonist', [
    m('div.infos', [
      m('h2', player.ai ? i18n('aiNameLevelAiLevel', 'Stockfish', player.ai) : renderUser(ctrl, player)),
      m('div', [
        player.user ? m('h3.rating', [
          player.rating,
          ratingDiff(player)
        ]) : null,
        renderMaterial(ctrl, player.color)
      ])
    ]),
    ctrl.clock ? clock.view(ctrl.clock, player.color, ctrl.isClockRunning() ? ctrl.data.game.player : null) : null
  ]);
}

function renderGameActions(ctrl) {
  var actions = [
    m('div.game_action[data-icon=O]'),
    m('div.game_action[data-icon=c].disabled')
  ];
  actions.push(replayView.renderButtons(ctrl.replay));

  return m('section#game_actions', [
    m('div', actions)
  ]);
}

function renderFooter(ctrl) {
  return [
    renderAntagonist(ctrl, ctrl.data.player),
    renderGameActions(ctrl)
  ];
}

function renderHeader(ctrl) {
  return renderAntagonist(ctrl, ctrl.data.opponent);
}

function renderBoard(ctrl) {
  var vw = utils.getViewportDims().vw;
  return m('section#board.grey.merida', {
    style: {
      height: vw + 'px'
    }
  }, [
    chessground.view(ctrl.chessground), renderPromotion(ctrl)
  ]);
}

module.exports = {
  renderBoard: renderBoard,
  renderFooter: renderFooter,
  renderHeader: renderHeader
};
