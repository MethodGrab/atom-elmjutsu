'use babel';

const CompositeDisposable = require('atom').CompositeDisposable;
import Config from './config';
import Indexer from './indexer';
import GoToSymbol from './go-to-symbol';
import Sidekick from './sidekick';
// import Finder from './finder';

export default {
  config: Config,

  activate() {
    this.indexer = new Indexer();
    this.goToSymbol = new GoToSymbol(this.indexer.getIndexer());
    this.sidekick = new Sidekick(this.indexer.getIndexer());
    // this.finder = new Finder();
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])[data-grammar^="source elm"]', {
      'elmjutsu:go-to-definition': () => this.indexer.goToDefinition(),
      'elmjutsu:return-from-definition': () => this.indexer.returnFromDefinition(),
      'elmjutsu:go-to-symbol': () => this.indexer.goToSymbol(),
      // 'elmjutsu:find-usages': () => this.finder.findUsages(),
      // 'elmjutsu:find-unused': () => this.finder.findUnused(),
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'elmjutsu:toggle-sidekick': () => this.sidekick.toggle()
    }));
  },

  deactivate() {
    this.indexer.destroy();
    this.sidekick.destroy();
    // this.finder.destroy();
    this.subscriptions.dispose();
  },

  // For `autocomplete-plus`.
  provideAutocomplete() {
    return require('./autocomplete-provider').provide(this.indexer.getIndexer());
  },

  // Provided by `linter-elm-make`.
  consumeGetWorkDirectory(getWorkDirectoryFunction) {
    // this.finder.setGetWorkDirectoryFunction(getWorkDirectoryFunction);
  }

};