//=============================================================================
// Yanfly Engine Plugins - Battle Engine Extension - Action Sequence Pack 2
// YEP_X_ActSeqPack2.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_X_ActSeqPack2 = true;

var Yanfly = Yanfly || {};
Yanfly.ASP2 = Yanfly.ASP2 || {};

//=============================================================================
 /*:
 * @plugindesc v1.08 (É necessário ter YEP_BattleEngineCore.js) Funções
 * visuais são adicionadas às sequências de ações do BEC.
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introdução
 * ============================================================================
 *
 * O plugin Action Sequence Pack 2 é um plugin de extensão para o Battle
 * Engine Core do Yanfly Engine Plugins. Esse plugin de extensão não
 * irá funcionar sem o plugin principal.
 *
 * Esse plugin de extensão contém as funções mais básicas usadas para
 * personalizar sequências de ações numa escala visual. Esse plugin
 * foca em fazer os combatentes a realizarem ações visuais.
 *
 * ============================================================================
 * Sequências de Ações - ala Melody
 * ============================================================================
 *
 * O Battle Engine Core inclui o sistema Battle Engine do Yanfly Engine Melody,
 * onde cada um dos aspectos dos efeitos de habilidade e itens podem ser
 * controlados a um certo ponto. Esses são chamados de Sequências de Ações,
 * onde cada comando na sequência de ação causa o jogo a realizar uma ação
 * individual distinta.
 *
 * Cada habilidade e item consiste de cinco diferentes sequências de ações.
 * Elas são as seguintes:
 *
 * 1. Acões de Set Up
 *   Eles preparam o combatente ativo antes de executar a ação e os seus
 * efeitos individuais. Normalmente o que você vê aqui são coisas como
 * o combatente ativo mover um pouco para frente, desembainhando sua arma, etc.
 * Essa etapa irá ocorrer antes que o combatente ativo gaste o custo de
 * sua habilidade ou item.
 *
 * 2. Acões Inteiras
 *   Essas ações vão afetar todos os alvos simultâneamente. Embora essa seção
 * não precisa ser usada, a maioria das ações vão usar isso para mostrar
 * animações sobre todos os inimigos. Essa etapa ocorre depois do custo de
 * habilidade e item.
 *
 * 3. Ações de Alvo
 *   Essa seção irá afetar todos os alvos individualmente. Usada primeiramente
 * por ataques físicos que irão entregar mais formas de dano. Ações que
 * ocorrem aqui não irão afetar outros alvos a não ser que seja ordenado
 * especificamente para afetar.
 *
 * 4. Ações de Seguir
 *   Essa seção irá se dedicar a trabalhos de cleanup depois das ações de
 * alvos individuais. Aqui, ela fará coisas como remover flags imortais,
 * começar eventos comuns, e mais.
 *
 * 5. Ações Terminadas
 *   Essa seção vai ter o close up das sequências de ações do combatente ativo.
 * Normalmente coisas como fazer esperar e aguardar no último minuto para
 * habilidades e itens, mover de volta para o lugar, e outros.
 *
 * Agora que você sabe cada um dos cinco passos de cada sequência de ação, aqui
 * estão os tags que você pode inserir dentro das habilidades e itens. Preste
 * atenção para cada nome de tag.
 *
 * 1. <setup action>                                5. <finish action>
 *     action list                                      action list
 *     action list                                      action list
 *    </setup action>                                  </finish action>
 *
 * 2. <whole action>       3. <target action>       4. <follow action>
 *     action list             action list              action list
 *     action list             action list              action list
 *    </whole action>         </target action>         </follow action>
 *
 * Eles irão fazer seus respectivos conjunto de ações. Os métodos para inserir
 * para a lista de ações podem ser achados embaixo no core do Help Manual.
 *
 * Além disso,  para prevenir que cada um dos seus noteboxes de item de seu
 * banco de dados esteja cheia de listas de sequências de ações, há um
 * atalho que você pode fazer para copiar todas as ações de set up, ações
 * inteiras, ações de alvo, ações de seguir, e ações terminadas com apenas
 * uma linha.
 *
 * <action copy: x:y>
 *
 * Substitua x com "item" ou "skill" para estabelecer o tipo para o código de
 * lista de ações para copiar diretamente. O número inteiro y é então o ID
 * atribuído para àquele específico tipo de objeto. Por exemplo, para copiar
 * as sequências de ações da 45º habilidade, o código seria
 * <action copy: skill:45> para qualquer coisa que irá aceitar esses códigos
 * de ações. Se você realmente usar esse notetag, ele levará prioridade sobre
 * qualquer outro custom que você pôs no notebox.
 *
 * ============================================================================
 * Digitamento de Alvo
 * ============================================================================
 *
 * Você pode perceber que em algumas das ações abaixo irá dizer "refer to
 * target typing" que é essa seção bem aqui. Aqui está uma rápida lista dos
 * vários alvos que você pode selecionar.
 *
 *   user; Isso irá selecionar o combatente ativo.
 *   target, targets; Isso irá selecionar os combatentes ativos em questão.
 *   actors, existing actors; Isso irá selecionar todos os personagens vivos.
 *   all actors; Isso irá selecionar todos personagens, incluindo os mortos.
 *   dead actors: Isso irá selecionar apenas os personagens mortos.
 *   actors not user; Isso irá selecionar todos os personagens vivos menos
 *   o usuário.
 *   actor x; Isso irá selecionar o personagem no slot x.
 *   character x; Isso irá selecionar o personagem específico com o ID de
 *     personagem de x
 *   enemies, existing enemies; Isso irá selecionar todos os inimigos vivos.
 *   all enemies; Isso irá selecionar todos os inimigos, incluindo os mortos.
 *   dead enemies: Isso irá selecionar apenas os inimigos mortos.
 *   enemies not user; Isso irá selecionar todos os inimigos menos o usuário.
 *   enemy x; Isso irá selecionar o inimigo no slot x.
 *   friends; Isso irá selecionar os aliados vivos do combatente.
 *   all friends; Isso irá selecionar todos os aliados do combatente, até os
 *     mortos.
 *   dead friends; Isso irá selecionar os aliados mortos do combatente.
 *   friends not user; Isso irá selecionar os aliados do combatente, menos
 *     ele mesmo.
 *   friend x: Isso irá selecionar o aliado do combatente no slot x.
 *   opponents; Isso irá selecionar os oponentes vivos do combatente.
 *   all opponents; Isso irá selecionar todos os oponentes do combatente.
 *   dead opponents; Isso irá selecionar os oponentes mortos do combatente.
 *   opponent x: Isso irá selecionar o oponente do combatente no slot x.
 *   all alive; Seleciona todos os personagens e inimigos vivos.
 *   all members; Seleciona todos os personagens e inimigos vivos e mortos.
 *   all dead; Seleciona todos os personagens e inimigos mortos.
 *   all not user; Isso irá selecionar todos os combatentes vivos menos o
 *     usuário.
 *   focus;  Seleciona o combatente ativo e seus alvos.
 *   not focus; Seleciona tudo menos o combatente ativo e seus alvos.
 *
 * ============================================================================
 * Sequência de Ações - Lista de Ações
 * ============================================================================
 *
 * Aqui contém a lista de ações que você pode usar dentro das cinco
 * sequências de ações. Cada ação tem uma função única e requer certos
 * formatos para operar propriamente.
 *
 *=============================================================================
 * ATTACK ANIMATION: target
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Mostra a animação de ataque do combatente ativo no(s) alvo(s). Essa será
 * a animação determinada pela(s) arma(s) do personagem. Se for um inimigo,
 * ela será determinada pela animação de ataque do inimigo.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: attack animation: target
 *=============================================================================
 *
 *=============================================================================
 * ENEMY EFFECT: target, effect-type
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Isso afeta apenas os inimigos. Faz o alvo mostrar um efeito 'whiten' ou
 * 'blink'.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: enemy effect: targets, whiten
 *                 enemy effect: targets, blink
 *=============================================================================
 *
 *=============================================================================
 * FACE target: args
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * FACE target1: FORWARD
 * FACE target1: BACKWARD
 * FACE target1: HOME
 * FACE target1: AWAY FROM HOME
 * FACE target1: POINT, x coordinate, y coordinate
 * FACE target1: AWAY FROM POINT, x coordinate, y coordinate
 * FACE target1: target2
 * FACE target1: AWAY FROM target2
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Isso fará o combatente a olhar para uma certa direção. Argumentos podem
 * ser usados nos formatos acima. Esse comando de sequência de ação fará o
 * target1 a olhar para qualquer daquelas direções. Se target2 for usado,
 * então target1 irá olhar para direções relativas ao target2.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: face user: forward
 *                 face target: backward
 *                 face enemies: home
 *                 face allies: away from home
 *                 face target: point, 20, 40
 *                 face target: away from point, 500, 600
 *                 face user: target
 *                 face target: away from user
 *=============================================================================
 *
 *=============================================================================
 * FADE OUT: (frames)
 * FADE IN: (frames)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Dá um fade out e fade in na tela, respectivamente. Você pode estabelecer
 * a quantidade de frames para o processo de fading. Se você omitir frames,
 * 60 frames serão usados por padrão.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: fade out
 *                 fade in: 10
 *=============================================================================
 *
 *=============================================================================
 * FLASH SCREEN: args
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * FLASH SCREEN: WHITE, (frames)
 * FLASH SCREEN: RED, (frames)
 * FLASH SCREEN: ORANGE, (frames)
 * FLASH SCREEN: YELLOW, (frames)
 * FLASH SCREEN: GREEN, (frames)
 * FLASH SCREEN: BLUE, (frames)
 * FLASH SCREEN: PURPLE, (frames)
 * FLASH SCREEN: MAGENTA, (frames)
 * FLASH SCREEN: BLACK, (frames)
 * FLASH SCREEN: (red), (green), (blue), (intensity), (frames)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causa a tela do jogo a piscar uma certa cor. Se para os argumentos você
 * usar um nome de cor, ele irá usar uma configuração pré-feita de piscamento.
 * Se você escolher usar suas próprias configurações, use o formato de
 * intensidade vermelho, verde, e azul para determinar qual cor você prefere.
 * Configurações de intensidade de vermelho, verde, e azul variam de 0 a 255.
 * Se frames forem usados, esse será a duração do piscamento da tela. Se
 * omitido, o contador padrão de frame será de 60 frames.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: flash screen: white
 *                 flash screen: red, 45
 *                 flash screen: 128, 170, 214, 170
 *                 flash screen: 68, 68, 68, 170, 45
 *=============================================================================
 *
 *=============================================================================
 * FLOAT target: (height), (frames)
 * FLOAT target: (height%), (frames)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causa o alvo a flutuar no ar acima do chão por height%. A altura é relativa
 * ao alvo flutuante. Usar 100% significa que o alvo flutuará acima do chão
 * 100% acima de sua altura. Se nenhum sinal de '%' for usado, o alvo flutuará
 * naquela quantidade de pixels em vez de numa porcentagem da altura do alvo.
 * Os frames determinam quantos frames demorarão para o alvo atingir àquela
 * altura. Usar 0% para a altura vai levar o alvo de volta para o chão.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: float user: 200%
 *                 float enemies: 500, 30
 *                 float target: 0%, 30
 *=============================================================================
 *
 *=============================================================================
 * HIDE BATTLE HUD
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Esconde o hud de batalha para não obstruir quaisquer animações sendo
 * reproduzidas. Você pode revelar o hud de batalha de novo usando
 * 'show battle hud'.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: hide battle hud
 *=============================================================================
 *
 *=============================================================================
 * JUMP target: (height), (frames)
 * JUMP target: (height%), (frames)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causa o alvo a pular uma altura relativa ao próprio alvo. Se o alvo
 * pular uma altura de 200%, a altura será de 200% da altura do alvo.
 * Se nenhum sinal de '%' for usado, o alvo pulará naquela quantidade
 * de pixels em vez de numa porcentagem da altura do alvo. A contagem
 * de frames é de quanto tempo o alvo ficará no ar. Você pode usar isso
 * com a sequência de ação 'Move' para fazer com que o alvo pareça estar
 * pulando uma distância.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: jump user: 150%
 *                 jump target: 300, 60
 *=============================================================================
 *
 *=============================================================================
 * MOTION type: target, (no weapon)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * MOTION WALK: target
 * MOTION STANDBY: target
 * MOTION CHANT: target
 * MOTION GUARD: target
 * MOTION DAMAGE: target
 * MOTION EVADE: target
 * MOTION ATTACK: target
 * MOTION THRUST: target
 * MOTION SWING: target
 * MOTION MISSILE: target
 * MOTION SKILL: target
 * MOTION SPELL: target
 * MOTION ITEM: target
 * MOTION ESCAPE: target
 * MOTION VICTORY: target
 * MOTION DYING: target
 * MOTION ABNORMAL: target
 * MOTION SLEEP: target
 * MOTION DEAD: target
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Força o alvo a realizar o específico tipo de ação no sideview. Se você
 * fizer um comando de sequência de ação para que o alvo realize 'attack',
 * o alvo automaticamente determinará baseado na arma em que ele estiver
 * equipando para usar um impulso, balanço, ou movimento de míssil. Ataque,
 * impulso, balanço e míssil também mostrarão a arma do alvo, se ele
 * tiver uma.
 *
 * If 'no weapon' is used after the target, no weapons will be displayed. This
 * effect will only work with the Thrust, Swing, and Missile motions.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: motion walk: user
 *                motion thrust: user, no weapon
 *=============================================================================
 *
 *=============================================================================
 * MOVE target: args
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * MOVE target1: HOME, (frames)
 * MOVE target1: RETURN, (frames)
 * MOVE target1: FORWARD, (distance), (frames)
 * MOVE target1: BACKWARD, (distance), (frames)
 * MOVE target1: POINT, x coordinate, y coordinate, (frames)
 * MOVE target1: target2, BASE, (frames)
 * MOVE target1: target2, CENTER, (frames)
 * MOVE target1: target2, HEAD, (frames)
 * MOVE target1: target2, FRONT BASE, (frames)
 * MOVE target1: target2, FRONT CENTER, (frames)
 * MOVE target1: target2, FRONT HEAD, (frames)
 * MOVE target1: target2, BACK BASE, (frames)
 * MOVE target1: target2, BACK CENTER, (frames)
 * MOVE target1: target2, BACK HEAD, (frames)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Esse é o comando de movimento. Argumentos podem ser usados nos formatos
 * acima. Esse comando de sequência de ação irá mover o target1 para qualquer
 * uma daquelas localizações listadas nos argumentos. Se for em direção ao
 * target2, você deve incluir qual localização relativa ao target2 para o
 * target1 viajar.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: move user: home, 20
 *                 move target: forward, 48, 12
 *                 move enemy 1: point, 400, 300
 *                 move actor 2: front base, 20
 *=============================================================================
 *
 *=============================================================================
 * OPACITY target: x, (frames)
 * OPACITY target: x%, (frames)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Muda a opacidade do alvo para x (0-255) ou x% (0% a 100%). Se você usar
 * 'frames', essa será a duração de frames para a mudança de opacidade para
 * o alvo.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: opacity user: 50%, 30
 *                 opacity not focus: 0
 *=============================================================================
 *
 *=============================================================================
 * SHOW BATTLE HUD
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Se o hud de batalha estava escondido usando 'hide battle hud', use isso para
 * mostrar o hud de batalha de volta para a tela do jogador.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: show battle hud
 *=============================================================================
 *
 *=============================================================================
 * SHAKE SCREEN: (power), (speed), (frames)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Causa a tela do jogo a balançar. Ajuste o power de 0-9, speed de 0-1,
 * e os frames para alterar a duração do balanceamento de tela. Se esses
 * valores forem omitidos, eles vão para os valores padrões de 5 power,
 * 5 speed, e 60 frames.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: shake screen
 *                 shake screen: 9
 *                 shake screen: 3, 9, 30
 *=============================================================================
 *
 *=============================================================================
 * TINT SCREEN: args
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * TINT SCREEN: NORMAL, (frames)
 * TINT SCREEN: DARK, (frames)
 * TINT SCREEN: SEPIA, (frames)
 * TINT SCREEN: SUNSET, (frames)
 * TINT SCREEN: NIGHT, (frames)
 * TINT SCREEN: (red), (green), (blue), (gray), (frames)
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Muda o tom da tela de batalha. Se usar os argumentos 'normal', 'dark',
 * 'sepia', 'sunset', ou 'night' a tela terá um tom pré-feito. Se não,
 * então os argumentos para os valores de vermelho, verde, azul, e cinza
 * têm que ser colodados para o tom. Vermelho, verde, e azul podem variar
 * de -255 a 255 enquanto que cinza vai variar de 0 a 255. Se frames forem
 * usados, isso mudará a duração com que a tela mudará para o tom. Se
 * omitido, a quantidade padrão de frames usados será de 60 frames.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: tint screen: normal
 *                 tint screen: sepia, 30
 *                 tint screen: 68, -34, -34, 0
 *                 tint screen: 68, -68, 0, 68, 45
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR FLOAT
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Espera para todas as mudanças de flutuação do combatente terminarem antes
 * de ir para a próxima ação na sequência de ação.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: wait for float
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR JUMP
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Espera todos os pulos do combatente terminarem antes de ir para a próxima
 * ação na sequência de ação.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: wait for jump
 *=============================================================================
 *
 *=============================================================================
 * WAIT FOR OPACITY
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Espera para todos os combatentes terminarem a mudança de opacidade antes de
 * ir para a próxima ação na sequência de ação.
 *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Exemplo de uso: wait for opacity
 *=============================================================================
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.08:
 * - State Icon and State Overlays will now synch together for floating and
 * jumping battlers.
 *
 * Version 1.07c:
 * - Synchronized battle animations to floating and jumping battlers.
 * 
 * Version 1.06:
 * - Updated weapon motions for YEP_X_AnimatedSVEnemies to work with sideview
 * enemies.
 *
 * Version 1.05:
 * - Creating compatibility for a future plugin.
 *
 * Version 1.04a:
 * - Rewrote and updated movement formulas.
 *
 * Version 1.03:
 * - Made a change to Motion action sequence. 'Wait' is now substituted for
 * 'Standby' as to not confuse it with the actual Motion Wait action sequence.
 * - Added a 'no weapon' option to Motion action sequences. This new tag will
 * only affect the 'Thrust', 'Swing', and 'Missile' motions.
 *
 * Version 1.02:
 * - Added a check for motion attack to differentiate between actor and enemy.
 *
 * Version 1.01:
 * - Updated help file to include Character X for target typing.
 *
 * Version 1.00:
 * - Finished plugin!
 */
//=============================================================================

if (Imported.YEP_BattleEngineCore) {

//=============================================================================
// Parameters
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_X_ActSeqPack2');
Yanfly.Param = Yanfly.Param || {};

//=============================================================================
// BattleManager
//=============================================================================

Yanfly.ASP2.BattleManager_processActionSequence =
  BattleManager.processActionSequence;
BattleManager.processActionSequence = function(actionName, actionArgs) {
  // ATTACK ANIMATION
  if (actionName === 'ATTACK ANIMATION') {
    return this.actionAttackAnimation(actionArgs);
  }
  // ENEMY EFFECT
  if (actionName === 'ENEMY EFFECT') {
    return this.actionEnemyEffect(actionArgs);
  }
  // FACE TARGET
  if (actionName.match(/FACE[ ](.*)/i)) {
    var string = String(RegExp.$1);
    if (this.makeActionTargets(string).length > 0) {
      return this.actionFace(string, actionArgs);
    }
  }
  // FADE IN, FADE OUT
  if (['FADE IN', 'FADE OUT'].contains(actionName)) {
    return this.actionFadeScreen(actionName, actionArgs);
  }
  // FLASH SCREEN
  if (actionName === 'FLASH SCREEN') {
    return this.actionFlashScreen(actionArgs);
  }
  // FLOAT TARGET
  if (actionName.match(/FLOAT[ ](.*)/i)) {
    var string = String(RegExp.$1);
    if (this.makeActionTargets(string).length > 0) {
      return this.actionFloat(string, actionArgs);
    }
  }
  // HIDE BATTLE HUD, SHOW BATTLE HUD
  if (['HIDE BATTLE HUD', 'SHOW BATTLE HUD'].contains(actionName)) {
    return this.actionBattleHud(actionName);
  }
  // JUMP TARGET
  if (actionName.match(/JUMP[ ](.*)/i)) {
    var string = String(RegExp.$1);
    if (this.makeActionTargets(string).length > 0) {
      return this.actionJump(string, actionArgs);
    }
  }
  // MOTION TYPE
  if (actionName.match(/MOTION[ ](.*)/i)) {
    return this.actionMotionTarget(String(RegExp.$1), actionArgs);
  }
  // MOVE TARGET
  if (actionName.match(/MOVE[ ](.*)/i)) {
    var string = String(RegExp.$1);
    if (this.makeActionTargets(string).length > 0) {
      return this.actionMove(string, actionArgs);
    }
  }
  // OPACITY TARGET
  if (actionName.match(/OPACITY[ ](.*)/i)) {
    var string = String(RegExp.$1);
    if (this.makeActionTargets(string).length > 0) {
      return this.actionOpacity(string, actionArgs);
    }
  }
  // SHAKE SCREEN
  if (actionName === 'SHAKE SCREEN') {
    return this.actionShakeScreen(actionArgs);
  }
  // TINT SCREEN
  if (actionName === 'TINT SCREEN') {
    return this.actionTintScreen(actionArgs);
  }
  // WAIT FOR FLOAT
  if (actionName === 'WAIT FOR FLOAT') {
    return this.actionWaitForFloat();
  }
  // WAIT FOR JUMP
  if (actionName === 'WAIT FOR JUMP') {
    return this.actionWaitForJump();
  }
  // WAIT FOR OPACITY
  if (actionName === 'WAIT FOR OPACITY') {
    return this.actionWaitForOpacity();
  }
  return Yanfly.ASP2.BattleManager_processActionSequence.call(this,
    actionName, actionArgs);
};

BattleManager.actionAttackAnimation = function(actionArgs) {
  var targets = this.makeActionTargets(actionArgs[0]);
  var mirror = false;
  if (actionArgs[1] && actionArgs[1].toUpperCase() === 'MIRROR') mirror = true;
  if (mirror && this._subject.isActor()) {
    this._logWindow.showActorAtkAniMirror(this._subject,
      targets.filter(Yanfly.Util.onlyUnique));
  } else {
    this._logWindow.showAttackAnimation(this._subject,
      targets.filter(Yanfly.Util.onlyUnique));
  }
  return true;
};

BattleManager.actionBattleHud = function(actionName) {
  if (actionName === 'HIDE BATTLE HUD') {
    this._windowLayer.x = Graphics.boxWidth * 495;
  } else if (actionName === 'SHOW BATTLE HUD') {
    this._windowLayer.x = 0;
  }
  return false;
}

BattleManager.actionEnemyEffect = function(actionArgs) {
    var targets = this.makeActionTargets(actionArgs[0]);
    if (targets.length < 1) return true;
    if (actionArgs[1].toUpperCase() === 'WHITEN') {
      targets.forEach(function(target) {
        if (target.isEnemy()) target.requestEffect('whiten');
      });
    } else if (actionArgs[1].toUpperCase() === 'BLINK') {
      targets.forEach(function(target) {
        if (target.isEnemy()) target.requestEffect('blink');
      });
    }
    return true;
};

BattleManager.actionFace = function(name, actionArgs) {
    var movers = this.makeActionTargets(name);
    if (movers.length < 1) return true;
    var cmd = actionArgs[0].toUpperCase();
    if (['FORWARD', 'NORMAL'].contains(cmd)) {
      movers.forEach(function(mover) {
        mover.spriteFaceForward();
      });
    } else if (['BACKWARD', 'MIRROR'].contains(cmd)) {
      movers.forEach(function(mover) {
        mover.spriteFaceBackward();
      });
    } else if (['HOME', 'ORIGIN'].contains(cmd)) {
      movers.forEach(function(mover) {
        mover.spriteFaceHome();
      });
    } else if (['AWAY FROM HOME', 'AWAY FROM ORIGIN'].contains(cmd)) {
      movers.forEach(function(mover) {
        mover.spriteFaceAwayHome();
      });
    } else if (['POINT', 'POSITION', 'COORDINATE', 'SCREEN', 'SCREEN POS',
    'COORDINATES'].contains(cmd)) {
      var destX = eval(actionArgs[1]) || 0;
      var destY = eval(actionArgs[2]) || 0;
      movers.forEach(function(mover) {
        mover.spriteFacePoint(destX, destY);
      });
    } else if (['AWAY FROM POINT', 'AWAY FROM POSITION', 'AWAY FROM COORDINATE',
    'AWAY FROM SCREEN', 'AWAY FROM SCREEN POS',
    'AWAY FROM COORDINATES'].contains(cmd)) {
      var destX = eval(actionArgs[1]) || 0;
      var destY = eval(actionArgs[2]) || 0;
      movers.forEach(function(mover) {
        mover.spriteFaceAwayPoint(destX, destY);
      });
    } else if (cmd.match(/AWAY[ ]FROM[ ](.*)/i)) {
      var targets = this.makeActionTargets(String(RegExp.$1));
      if (targets.length < 1) return false;
      var destX = 0;
      var destY = 0;
      targets.forEach(function(target) {
        destX += target.spritePosX();
        destY += target.spritePosY();
      }, this);
      destX /= targets.length;
      destY /= targets.length;
      movers.forEach(function(mover) {
        mover.spriteFaceAwayPoint(destX, destY);
      }, this);
    } else {
      var targets = this.makeActionTargets(actionArgs[0]);
      if (targets.length < 1) return false;
      var destX = 0;
      var destY = 0;
      targets.forEach(function(target) {
        destX += target.spritePosX();
        destY += target.spritePosY();
      }, this);
      destX /= targets.length;
      destY /= targets.length;
      movers.forEach(function(mover) {
        mover.spriteFacePoint(destX, destY);
      }, this);
    }
    return false;
};

BattleManager.actionFadeScreen = function(actionName, actionArgs) {
  var frames = actionArgs[0] || 60;
  if (actionName === 'FADE IN') {
    $gameScreen.startFadeIn(frames);
  } else if (actionName === 'FADE OUT') {
    $gameScreen.startFadeOut(frames);
  }
  return false;
};

BattleManager.actionFlashScreen = function(actionArgs) {
    if (actionArgs[0].toUpperCase() === 'WHITE') {
      var flash = [255, 255, 255, 255];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'RED') {
      var flash = [255, 0, 0, 255];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'ORANGE') {
      var flash = [255, 128, 0, 255];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'YELLOW') {
      var flash = [255, 255, 0, 255];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'GREEN') {
      var flash = [0, 255, 0, 255];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'BLUE') {
      var flash = [0, 128, 255, 255];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'PURPLE') {
      var flash = [128, 64, 255, 255];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'MAGENTA') {
      var flash = [255, 0, 255, 255];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'BLACK') {
      var flash = [0, 0, 0, 255];
      var frames = actionArgs[1] || 60;
    } else {
      var red = actionArgs[0] || 0;
      var green = actionArgs[1] || 0;
      var blue = actionArgs[2] || 0;
      var intensity = actionArgs[3] || 0;
      var frames = actionArgs[4] || 60;
      var flash = [parseInt(red), parseInt(green),
          parseInt(blue), parseInt(intensity)];
    }
    $gameScreen.startFlash(flash, frames);
    return false;
};

BattleManager.actionFloat = function(name, actionArgs) {
    var movers = this.makeActionTargets(name);
    if (movers.length < 1) return true;
    var cmd = actionArgs[0];
    var frames = actionArgs[1] || 12;
    var pixels = 0;
    if (cmd.match(/(\d+)([%％])/i)) {
      var floatPeak = parseFloat(RegExp.$1 * 0.01);
    } else if (cmd.match(/(\d+)/i)) {
      pixels = parseInt(RegExp.$1);
      var floatPeak = 0.0;
    } else {
      var floatPeak = 1.0;
    }
    movers.forEach(function(mover) {
      var floatRate = floatPeak + (pixels / mover.spriteHeight());
      mover.spriteFloat(floatRate, frames);
    });
    return false;
};

BattleManager.actionJump = function(name, actionArgs) {
    var movers = this.makeActionTargets(name);
    if (movers.length < 1) return true;
    var cmd = actionArgs[0];
    var frames = actionArgs[1] || 12;
    var pixels = 0;
    if (cmd.match(/(\d+)([%％])/i)) {
      var jumpPeak = parseFloat(RegExp.$1 * 0.01);
    } else if (cmd.match(/(\d+)/i)) {
      pixels = parseInt(RegExp.$1);
      var jumpPeak = 0.0;
    } else {
      var jumpPeak = 1.0;
    }
    movers.forEach(function(mover) {
      var jumpRate = jumpPeak + (pixels / mover.spriteHeight());
      mover.spriteJump(jumpRate, frames);
    });
    return true;
};

BattleManager.actionMotionTarget = function(name, actionArgs) {
    if (name.toUpperCase() === 'WAIT') return this.actionMotionWait(actionArgs);
    if (name.toUpperCase() === 'STANDBY') name = 'WAIT';
    var movers = this.makeActionTargets(actionArgs[0]);
    if (movers.length < 1) return true;
    var cmd = name.toLowerCase();
    var motion = 'wait';
    if (actionArgs[1] && actionArgs[1].toUpperCase() === 'NO WEAPON') {
      var showWeapon = false;
    } else {
      var showWeapon = true;
    }
    if (['wait', 'chant', 'guard', 'evade', 'skill', 'spell', 'item', 'escape',
    'victory', 'dying', 'abnormal', 'sleep', 'dead'].contains(cmd)) {
      motion = cmd;
    } else if (['walk', 'move'].contains(cmd)) {
      motion = 'walk';
    } else if (['damage', 'hit'].contains(cmd)) {
      motion = 'damage';
    } else if (['attack'].contains(cmd)) {
      movers.forEach(function(mover) {
        mover.performAttack();
      });
      return false;
    } else if (['thrust', 'swing', 'missile'].contains(cmd)) {
      motion = cmd;
      movers.forEach(function(mover) {
        mover.forceMotion(motion);
        if (mover.isActor() && showWeapon) {
          var weapons = mover.weapons();
          var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
          var attackMotion = $dataSystem.attackMotions[wtypeId];
          if (attackMotion && [0, 1, 2].contains(attackMotion.type)) {
            mover.startWeaponAnimation(attackMotion.weaponImageId);
          }
        }
        if (Imported.YEP_X_AnimatedSVEnemies) {
          if (mover.isEnemy() && mover.hasSVBattler() && showWeapon) {
            var attackMotion = $dataSystem.attackMotions[wtypeId];
            mover.startWeaponAnimation(mover.weaponImageId());
          }
        }
      });
      return false;
    }
    movers.forEach(function(mover) {
      mover.forceMotion(motion);
    });
    return false;
};

BattleManager.actionMove = function(name, actionArgs) {
    if (!$gameSystem.isSideView()) return true;
    var movers = this.makeActionTargets(name);
    if (movers.length < 1) return true;
    var cmd = actionArgs[0].toUpperCase();
    if (['HOME', 'ORIGIN'].contains(cmd)) {
      var frames = actionArgs[1] || 12;
      movers.forEach(function(mover) {
        mover.battler().startMove(0, 0, frames);
        mover.requestMotion('walk');
        mover.spriteFaceHome();
      });
    } else if (['RETURN'].contains(cmd)) {
      var frames = actionArgs[1] || 12;
      movers.forEach(function(mover) {
        mover.battler().startMove(0, 0, frames);
        mover.requestMotion('evade');
        mover.spriteFaceForward();
      });
    } else if (['FORWARD', 'FORWARDS', 'BACKWARD',
    'BACKWARDS'].contains(cmd)) {
      var distance = actionArgs[1] || Yanfly.Param.BECStepDist;
      if (['BACKWARD', 'BACKWARDS'].contains(cmd)) distance *= -1;
      var frames = actionArgs[2] || 12;
      movers.forEach(function(mover) {
        mover.battler().moveForward(distance, frames);
        mover.requestMotion('walk');
        if (['FORWARD', 'FORWARDS'].contains(cmd)) {
          mover.spriteFaceForward();
        } else {
          mover.spriteFaceBackward();
        }
      });
    } else if (['POINT', 'POSITION', 'COORDINATE', 'SCREEN', 'SCREEN POS',
    'COORDINATES'].contains(cmd)) {
      var destX = eval(actionArgs[1]) || 0;
      var destY = eval(actionArgs[2]) || 0;
      var frames = actionArgs[3] || 12;
      movers.forEach(function(mover) {
        mover.battler().moveToPoint(destX, destY, frames);
        mover.requestMotion('walk');
        mover.spriteFacePoint(destX, destY);
      });
    } else {
      var targets = this.makeActionTargets(actionArgs[0]);
      var frames = actionArgs[2] || 12;
      var type = actionArgs[1].toUpperCase();
      if (targets.length < 1) return false;
      for (var i = 0; i < movers.length; ++i) {
        var mover = movers[i];
        if (!mover) continue;
        if (['BASE', 'FOOT', 'FEET'].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'center');
          var destY = this.actionMoveY(mover, targets, 'foot');
        } else if (['CENTER', 'MIDDLE'].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'center');
          var destY = this.actionMoveY(mover, targets, 'center');
        } else if (['HEAD', 'TOP'].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'center');
          var destY = this.actionMoveY(mover, targets, 'head');
        } else if (['FRONT BASE', 'FRONT FOOT', 'FRONT FEET',
        'FRONT'].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'front');
          var destY = this.actionMoveY(mover, targets, 'foot');
        } else if (['BACK BASE', 'BACK FOOT', 'BACK FEET',
        'BACK'].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'back');
          var destY = this.actionMoveY(mover, targets, 'foot');
        } else if (['FRONT CENTER', 'FRONT MIDDLE'].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'front');
          var destY = this.actionMoveY(mover, targets, 'center');
        } else if (['BACK CENTER', 'BACK MIDDLE',].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'back');
          var destY = this.actionMoveY(mover, targets, 'center');
        } else if (['FRONT HEAD', 'FRONT TOP'].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'front');
          var destY = this.actionMoveY(mover, targets, 'head');
        } else if (['BACK HEAD', 'BACK TOP'].contains(type)) {
          var destX = this.actionMoveX(mover, targets, 'back');
          var destY = this.actionMoveY(mover, targets, 'head');
        }
        mover.battler().moveToPoint(destX, destY, frames);
        mover.spriteFacePoint(destX, destY);
      }
    }
    return true;
};

BattleManager.actionMoveX = function(mover, targets, value) {
    value = this.actionMoveXLocation(mover, targets, value);
    var max = targets.length;
    var moverWidth = mover.spriteWidth();
    if (value === 'center') {
      var destX = null;
    } else {
      var destX = (value === 'left') ? Graphics.boxWidth : 0;
    }
    for (var i = 0; i < max; ++i) {
      var target = targets[i];
      if (!target) continue;
      var targetWidth = target.spriteWidth();
      var point = target.spritePosX();
      if (value === 'center') {
        destX = (destX === null) ? 0 : destX;
        destX += point;
      } else if (value === 'left') {
        point -= targetWidth / 2;
        point -= (mover.isActor() ? 1 : 1) * moverWidth / 2;
        destX = Math.min(point, destX);
      } else {
        point += targetWidth / 2;
        point += (mover.isActor() ? 1 : 1) * moverWidth / 2;
        destX = Math.max(point, destX);
      }
    }
    if (value === 'center') destX /= max;
    return destX;
};

BattleManager.actionMoveXLocation = function(mover, targets, value) {
    if (value === 'center') return 'center';
    var actors = 0;
    var enemies = 0;
    var max = targets.length;
    for (var i = 0; i < max; ++i) {
      var target = targets[i];
      if (!target) continue;
      if (target.isActor()) actors += 1;
      if (target.isEnemy()) enemies += 1;
    }
    if (actors > 0 && enemies === 0) {
      return (value === 'front') ? 'left' : 'right';
    } else if (actors === 0 && enemies > 0) {
      return (value === 'front') ? 'right' : 'left';
    } else {
      if (mover.isActor()) {
        return (value === 'front') ? 'right' : 'left';
      } else { // enemy
        return (value === 'front') ? 'left' : 'right';
      }
    }
    return 'center';
};

BattleManager.actionMoveY = function(mover, targets, value) {
    var max = targets.length;
    var destY = 0;
    var point = (value === 'head') ? Graphics.boxHeight : 0;
    for (var i = 0; i < max; ++i) {
      var target = targets[i];
      if (!target) continue;
      if (value === 'head') {
        point = Math.min(target.spritePosY() - target.spriteHeight(), point);
      } else if (value === 'center') {
        point += target.spritePosY() - target.spriteHeight() / 2;
      } else { // foot
        point = Math.max(target.spritePosY(), point);
      }
    }
    destY = (value === 'center') ? point / max : point;
    return destY;
};

BattleManager.actionOpacity = function(name, actionArgs) {
    var targets = this.makeActionTargets(name);
    if (targets.length < 1) return true;
    var cmd = actionArgs[0];
    var frames = actionArgs[1] || 12;
    if (cmd.match(/(\d+)([%％])/i)) {
      var opacity = parseInt(RegExp.$1 * 0.01 * 255).clamp(0, 255);
    } else if (cmd.match(/(\d+)/i)) {
      var opacity = parseInt(RegExp.$1);
    } else {
      return false;
    }
    targets.forEach(function(target) {
      target.spriteOpacity(opacity, frames);
    });
    return false;
};

BattleManager.actionTintScreen = function(actionArgs) {
    if (actionArgs[0].toUpperCase() === 'NORMAL') {
      var tint = [0, 0, 0, 0];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'DARK') {
      var tint = [-68, -68, -68, 0];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'SEPIA') {
      var tint = [34, -34, -68, 170];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'SUNSET') {
      var tint = [68, -34, -34, 0];
      var frames = actionArgs[1] || 60;
    } else if (actionArgs[0].toUpperCase() === 'NIGHT') {
      var tint = [68, -68, 0, 68];
      var frames = actionArgs[1] || 60;
    } else {
      var red = actionArgs[0] || 0;
      var green = actionArgs[1] || 0;
      var blue = actionArgs[2] || 0;
      var gray = actionArgs[3] || 0;
      var frames = actionArgs[4] || 60;
      var tint = [parseInt(red), parseInt(green),
          parseInt(blue), parseInt(gray)];
    }
    $gameScreen.startTint(tint, frames);
    return false;
};

BattleManager.actionShakeScreen = function(actionArgs) {
    var power = actionArgs[0] || 5;
    var speed = actionArgs[1] || 5;
    var frames = actionArgs[2] || 60;
    $gameScreen.startShake(parseInt(power), parseInt(speed), parseInt(frames));
    return false;
};

BattleManager.actionWaitForFloat = function() {
    this._logWindow.waitForFloat();
    return false;
};

BattleManager.actionWaitForJump = function() {
    this._logWindow.waitForJump();
    return false;
};

BattleManager.actionWaitForOpacity = function() {
    this._logWindow.waitForOpacity();
    return false;
};

BattleManager.setWindowLayer = function(windowLayer) {
    this._windowLayer = windowLayer;
};

//=============================================================================
// Sprite_Battler
//=============================================================================

Yanfly.ASP2.Sprite_Battler_initMembers = Sprite_Battler.prototype.initMembers;
Sprite_Battler.prototype.initMembers = function() {
    Yanfly.ASP2.Sprite_Battler_initMembers.call(this);
    this.resetFloat();
    this.setupJump(0, 0);
    this.resetOpacity();
};

Sprite_Battler.prototype.resetFloat = function() {
    this._floatHeight = 0.0;
    this._floatTarget = 0;
    this._floatDur = 0;
    this._floatRate = 0;
};

Sprite_Battler.prototype.resetOpacity = function() {
    this._opacityTarget = 255;
    this._opacityDur = 0;
    this._opacityRate = 0;
    this._opacityChanging = false;
};

Sprite_Battler.prototype.setupFloat = function(floatHeight, floatDuration) {
    floatDuration = Math.max(1, floatDuration);
    this._floatTarget = floatHeight;
    this._floatDur = floatDuration;
    var rate = Math.abs(this._floatHeight - floatHeight) / floatDuration;
    this._floatRate = rate;
};

Sprite_Battler.prototype.setupJump = function(jumpHeight, jumpDuration) {
    this._jumpHeight = jumpHeight;
    this._jumpDur = jumpDuration;
    this._jumpFull = jumpDuration;
};

Sprite_Battler.prototype.setupOpacityChange = function(target, duration) {
    duration = Math.max(1, duration);
    this._opacityTarget = target;
    this._opacityDur = duration;
    var rate = Math.abs(this.opacity - target) / duration;
    this._opacityRate = rate;
    this._opacityChanging = true;
};

Yanfly.ASP2.Sprite_Battler_update = Sprite_Battler.prototype.update;
Sprite_Battler.prototype.update = function() {
    Yanfly.ASP2.Sprite_Battler_update.call(this);
    if (this._battler) {
      this.updateFloat();
      this.updateStateSprites();
      this.updateWeapon();
      this.updateOpacity();
    }
};

Sprite_Battler.prototype.updateFloat = function() {
    if (!this._battler) return;
    if (this._floatDur > 0) this._floatDur--;
    if (this._jumpDur > 0) this._jumpDur--;
    var baseY = this._battler.anchorY();
    var floatHeight = this.getFloatHeight();
    var jumpHeight = this.getJumpHeight();
    var height = floatHeight + jumpHeight;
    if (this._mainSprite && this._mainSprite.bitmap) {
      var rate = this._battler.spriteHeight() / this._mainSprite.height;
      this._mainSprite.anchor.y = (baseY + height * rate);
      this._weaponSprite.anchor.y = this._mainSprite.anchor.y;
    } else {
      this.anchor.y = (baseY + height);
    }
};

Sprite_Battler.prototype.updateStateSprites = function() {
    var height = this._battler.spriteHeight() * -1;
    height -= Sprite_StateIcon._iconHeight;
    if (this._stateIconSprite) this._stateIconSprite.y = height;
    if (this._stateSprite) {
      this._stateSprite.y = (this._battler.spriteHeight() - 64) * -1;
    }
    var heightRate = 0;
    heightRate += this.getFloatHeight();
    heightRate += this.getJumpHeight();
    if (this._enemy && this._enemy.isFloating()) {
      heightRate += this.addFloatingHeight();
    };
    var height = this._battler.spriteHeight();
    if (this._stateIconSprite) {
      this._stateIconSprite.y += Math.ceil(heightRate * -height);
    }
    if (this._stateSprite) {
      this._stateSprite.y += Math.ceil(heightRate * -height);
    }
};

Sprite_Battler.prototype.updateWeapon = function() {
    if (!this._battler) return;
    if (!this._battler.isActor()) return;
    this._weaponSprite.anchor.y = this._mainSprite.anchor.y;
};

Sprite_Battler.prototype.getFloatHeight = function() {
    if (this._floatDur <= 0) {
      this._floatHeight = this._floatTarget;
    } else {
      var target = this._floatTarget;
      var rate = this._floatRate;
      if (this._floatHeight >= target) {
        this._floatHeight = Math.max(target, this._floatHeight - rate);
      } else {
        this._floatHeight = Math.min(target, this._floatHeight + rate);
      }
    }
    return this._floatHeight;
};

Sprite_Battler.prototype.getJumpHeight = function() {
    if (this._jumpDur <= 0) {
      return 0;
    } else {
      var x = this._jumpFull - this._jumpDur;
      var h = this._jumpFull / 2;
      var k = this._jumpHeight;
      var a = -k / Math.pow(h, 2);
      var height = a * Math.pow((x - h), 2) + k;
    }
    return height;
};

Sprite_Battler.prototype.updateOpacity = function() {
    if (this.antiOpacityChange()) return;
    this._opacityDur--;
    if (this._opacityDur <= 0) {
      if (this.opacity !== this._opacityTarget) {
        this.opacity = this._opacityTarget;
      }
      this._opacityChanging = false;
    } else {
      var target = this._opacityTarget;
      var rate = this._opacityRate;
      if (this.opacity >= target) {
        this.opacity = Math.max(target, this.opacity - rate);
      } else {
        this.opacity = Math.min(target, this.opacity + rate);
      }
    }
};

Sprite_Battler.prototype.antiOpacityChange = function() {
    if (!this._opacityChanging) return true;
    return false;
};

Sprite_Battler.prototype.isFloating = function() {
    return this._floatDur > 0;
};

Sprite_Battler.prototype.isJumping = function() {
    return this._jumpDur > 0;
};

Sprite_Battler.prototype.isChangingOpacity = function() {
    return this._opacityDur > 0;
};

//=============================================================================
// Sprite_Animation
//=============================================================================

Yanfly.ASP2.Sprite_Animation_updatePosition =
    Sprite_Animation.prototype.updatePosition;
Sprite_Animation.prototype.updatePosition = function() {
    Yanfly.ASP2.Sprite_Animation_updatePosition.call(this);
    if (this._animation.position === 3) return;
    if (this.isBattlerRelated()) this.updateBattlerPosition();
};

Sprite_Animation.prototype.isBattlerRelated = function() {
    if (this._target instanceof Sprite_Battler) return true;
    if (this._target.parent instanceof Sprite_Battler) return true;
    return false;
};

Sprite_Animation.prototype.updateBattlerPosition = function() {
    if (this._target instanceof Sprite_Battler) {
      var target = this._target;
    } else if (this._target.parent instanceof Sprite_Battler) {
      var target = this._target.parent;
    } else {
      return;
    }
    if (!target.bitmap) return;
    if (target.bitmap.height <= 0) return;
    var heightRate = target.getFloatHeight() + target.getJumpHeight();
    var height = heightRate * target.bitmap.height;
    this.y -= height;
};

//=============================================================================
// Spriteset_Battle
//=============================================================================

Spriteset_Battle.prototype.isAnyoneFloating = function() {
    return this.battlerSprites().some(function(sprite) {
        return sprite.isFloating();
    });
};

Spriteset_Battle.prototype.isAnyoneJumping = function() {
    return this.battlerSprites().some(function(sprite) {
        return sprite.isJumping();
    });
};

Spriteset_Battle.prototype.isAnyoneChangingOpacity = function() {
    return this.battlerSprites().some(function(sprite) {
        return sprite.isChangingOpacity();
    });
};

//=============================================================================
// Game_Battler
//=============================================================================

Game_Battler.prototype.spriteFloat = function(floatHeight, floatDuration) {
    if (!this.battler()) return;
    if (!this.spriteCanMove()) return;
    if (!$gameSystem.isSideView()) return;
    this.battler().setupFloat(floatHeight, floatDuration);
};

Game_Battler.prototype.spriteJump = function(jumpHeight, jumpDuration) {
    if (!this.battler()) return;
    if (!this.spriteCanMove()) return;
    if (!$gameSystem.isSideView()) return;
    this.battler().setupJump(jumpHeight, jumpDuration);
};

Game_Battler.prototype.spriteOpacity = function(opacity, duration) {
    if (!this.battler()) return;
    this.battler().setupOpacityChange(opacity, duration);
};

//=============================================================================
// Scene_Battle
//=============================================================================

Yanfly.ASP2.Scene_Base_createWindowLayer =
    Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function() {
    Yanfly.ASP2.Scene_Base_createWindowLayer.call(this);
    BattleManager.setWindowLayer(this._windowLayer);
};

//=============================================================================
// Window_BattleLog
//=============================================================================

Yanfly.ASP2.Window_BattleLog_updateWaitMode =
    Window_BattleLog.prototype.updateWaitMode;
Window_BattleLog.prototype.updateWaitMode = function() {
    if (this._waitMode === 'float') {
      if (this._spriteset.isAnyoneFloating()) return true;
    } else if (this._waitMode === 'jump') {
      if (this._spriteset.isAnyoneJumping()) return true;
    } else if (this._waitMode === 'opacity') {
      if (this._spriteset.isAnyoneChangingOpacity()) return true;
    }
    return Yanfly.ASP2.Window_BattleLog_updateWaitMode.call(this);
};

Window_BattleLog.prototype.waitForFloat = function() {
    this.setWaitMode('float');
};

Window_BattleLog.prototype.waitForJump = function() {
    this.setWaitMode('jump');
};

Window_BattleLog.prototype.waitForOpacity = function() {
    this.setWaitMode('opacity');
};

//=============================================================================
// End of File
//=============================================================================
};
