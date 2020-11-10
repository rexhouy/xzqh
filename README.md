# Xzqh

Rails 行政区划选择控件

## Usage

application.js:
//= require xzqh/main.js

application.css:
\*= require xzqh/main.css

routes.rb:
mount Xzqh::Engine => "/"

javascript:
xzqh.open(["云南省", "昆明市", "五华区"], function(d) {console.log(d)} )

## Installation

```ruby
gem 'xzqh'
```

And then execute:

```bash
$ bundle
```

Or install it yourself as:

```bash
$ gem install xzqh
```

## Contributing

Contribution directions go here.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
