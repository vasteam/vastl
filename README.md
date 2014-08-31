# Vasteam web project build tools #

## Version ##

    0.1.2

## Install ##
    npm install -g vascli


## Command-line Usage ##

初始化(在工程目录打开命令行)
将会自动生成工程配置文件（project.js）和compass配置文件(config.rb)， 不会主动覆盖，需要手动删除.

	vascli init --usecompass

生成离线包
    vascli zip

拷贝文件到发布目录（dist） ( 具体配置见 project.js)
    vascli copy

清理临时文件( 具体配置见 project.js)
	vascli clean


prefixer重编译dist中的css文件 ( 具体配置见 project.js)
因为prepros完整compass支持模式下无法启用 自带prefixer
	vascli prefix