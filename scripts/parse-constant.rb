#!/usr/bin/env ruby
# Usage: ruby scripts/parse-constant.rb < constant.lua > public/assets/constants.json
# Parses ygopro-scripts/constant.lua into a JSON completion data file.

require 'json'

constants = []

STDIN.each_line do |line|
  line = line.chomp

  next if line.empty?
  next if line.start_with?('--') && !line.match?(/^\w+\s*=/)

  match = line.match(/^(\w+)\s*=\s*(\S+)(?:\s*--\s*(.*))?$/)
  next unless match

  name = match[1]
  value = match[2]
  description = match[3]&.strip

  next if name.empty? || value.empty?

  constants << {
    "name" => name,
    "value" => value,
    "description" => description
  }
end

puts JSON.pretty_generate(constants)
