# frozen_string_literal: true

module Jekyll
    module Generators
        class DirectoryVariables < Generator
            def generate(site)
                baseurl = site.config['baseurl']
                site.config['assets'] = {
                    "favicon_dir" => "#{baseurl}/assets/favicon",
                    "js_dir" => "#{baseurl}/assets/js",
                    "css_dir" => "#{baseurl}/assets/css",
                    "images_dir" => "#{baseurl}/static/images",
                }
            end
        end
    end
end
