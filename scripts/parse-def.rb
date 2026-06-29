#!/usr/bin/env ruby
# Usage: ruby scripts/parse-def.rb < def.lua > public/assets/completions.json
# Parses ygopro-scripts-define/def.lua into a JSON completion data file.

require 'json'

classes = {}
current_comment = []
current_class = nil

STDIN.each_line do |line|
  line = line.chomp

  if line.start_with?("---@class ")
    current_class = line.sub("---@class ", "").strip
    classes[current_class] ||= { "fields" => [], "methods" => [] }
    current_comment = []
    next
  end

  if line.start_with?("---@field ")
    if current_class
      field = line.sub("---@field ", "").strip
      name, type = field.split(" ", 2)
      classes[current_class]["fields"] << { "name" => name, "type" => type }
    end
    next
  end

  if line.start_with?("---")
    current_comment << line.sub(/^---/, "").strip
    next
  end

  if line =~ /^function (\w+)\.(\w+)\((.*)\) end$/
    class_name = $1
    method_name = $2
    raw_params = $3

    next unless classes.key?(class_name)

    description_parts = []
    params = []
    returns = []

    current_comment.each do |comment|
      if comment.start_with?("@param")
        param_str = comment.sub(/^@param\s+/, "")
        # Handle varargs: "...", "...?", "... any"
        if param_str.match?(/^\.\.\./)
          param_type = param_str.sub(/^\.\.\.\??\s*/, "")
          params << { "name" => "...", "type" => param_type.empty? ? "any" : param_type }
        else
          # Handle: "name Type", "name? Type", "name? Type default: value"
          name, type = param_str.split(/\s+/, 2)
          name = name.sub(/\?\s*$/, "")  # remove ? suffix
          type = type.sub(/\s+default:.*$/, "") if type  # remove default:
          params << { "name" => name, "type" => type || "any" }
        end
      elsif comment.start_with?("@return")
        ret = comment.sub(/^@return\s+/, "").strip
        returns << ret
      else
        description_parts << comment unless comment.empty?
      end
    end

    classes[class_name]["methods"] << {
      "name" => method_name,
      "description" => description_parts.join("\n"),
      "params" => params,
      "returns" => returns
    }
  end

  current_comment = [] unless line.start_with?("---")
end

# Remove empty classes and sort
result = {}
classes.each do |name, data|
  next if data["methods"].empty? && data["fields"].empty?
  result[name] = data
end

puts JSON.pretty_generate(result)
