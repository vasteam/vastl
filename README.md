# Vasteam web project build tools #

    v0.0.1

## Install ##
    npm install -g vastl


## Command-line Usage ##

初始化(只生成工程配置文件)

    vastl init

初始化(同时生成 工程配置文件 和 compass配置文件)

    vastl init --usecompass

生成离线包

    vastl zip

拷贝文件到发布目录（dist） ( 具体配置见 project.js)

    vastl copy

清理临时文件( 具体配置见 project.js)

    vastl clean


prefixer重编译dist中的css文件 ( 具体配置见 project.js)
因为prepros完整compass支持模式下无法启用 自带prefixer

    vastl prefix