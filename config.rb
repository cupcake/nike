require 'static-sprockets'
require 'react-jsx-sprockets'
require 'marbles-js'
require 'raven-js'
require 'yajl'

StaticSprockets.sprockets_config do |environment|
  MarblesJS::Sprockets.setup(environment)
  RavenJS::Sprockets.setup(environment)
end

StaticSprockets.configure(
  :asset_roots => [
    File.expand_path(File.join(File.dirname(__FILE__), 'lib')),
    File.expand_path(File.join(File.dirname(__FILE__), 'vendor'))
  ],
  :asset_types => %w( javascripts stylesheets fonts ),
  :layout => File.expand_path(File.join(File.dirname(__FILE__), 'lib', 'nike.html.erb')),
  :layout_output_name => 'nike.html',
  :output_dir => ENV['OUTPUT_DIR'] || File.expand_path(File.join(File.dirname(__FILE__), 'build')),
  :asset_root => ENV['ASSET_ROOT'] || '/assets'
)
