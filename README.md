# glnmaps

glnmaps(GeoLoNia Light and Neat Maps)は、各自治体が公開しているCSV形式のオープンデータをブラウザの地図上で確認できるツールです。
技術的な知識がなくても、誰でも簡単に使える平易なツールをめざしています。
ソースは1個のHTMLファイルとしてダウンロードできるので、それをホスティングして公開することも簡単です。

## 使い方

### 1. オープンデータとして公開されているCSVファイルを用意

各自治体のホームページなどで公開されているオープンデータのCSVファイルをダウンロードします。[データカタログ横断検索システム](https://search.ckan.jp/)で探すのも用意でしょう。

サンプルとして東京都調布市が公開している公共施設のデータセットを用意しておきました。

[東京都 調布市 公共施設 データセット](https://champierre.github.io/sample.csv)

※ オープンデータを管理するには[dim](https://github.com/c-3lab/dim)を使うと便利です。サンプルの[dim.json](https://champierre.github.io/dim.json)をダウンロードして、

```
dim install
```

と実行すれば上記サンプルを含めたデータセットを簡単に用意できます。

参考: [そろそろオープンデータを無秩序に管理するのは卒業したいので📦データを管理するパッケージマネージャを開発した【ツール開発】](https://qiita.com/ryo-ma/items/0505f7790ad2b12bcdc2)

### 2. glnmapsを使って地図に表示

```
glnmaps <CSVファイルのパス>
```

を実行するだけです。

```
glnmaps is running. Access it at: http://localhost:3000/
```

というメッセージが表示されたら、ブラウザを開き http://localhost:3000/ にアクセスしてください。

## インストール

### 1. glnmapsのバイナリをダウンロード

[aarch64-apple-darwin](https://champierre.github.io/glnmaps/binaries/aarch64-apple-darwin-glnmaps)

```
curl -L https://champierre.github.io/glnmaps/binaries/aarch64-apple-darwin-glnmaps -o /usr/local/bin/glnmaps
```

[x86_64-apple-darwin](https://champierre.github.io/glnmaps/binaries/x86_64-apple-darwin-glnmaps)

```
curl -L https://champierre.github.io/glnmaps/binaries/x86_64-apple-darwin-glnmaps -o /usr/local/bin/glnmaps
```

[x86_64-pc-windows-msvc](https://champierre.github.io/glnmaps/binaries/x86_64-pc-windows-msvc-glnmaps)

```
curl -L https://champierre.github.io/glnmaps/binaries/x86_64-pc-windows-msvc-glnmaps -o /usr/local/bin/glnmaps
```

[x86_64-unknown-linux-gnu](https://champierre.github.io/glnmaps/binaries/x86_64-unknown-linux-gnu-glnmaps)

```
curl -L https://champierre.github.io/glnmaps/binaries/x86_64-unknown-linux-gnu-glnmaps -o /usr/local/bin/glnmaps
```

### 2. 実行できるようにアクセス権を変更

```
chmod a+x /usr/local/bin/glmaps
```
