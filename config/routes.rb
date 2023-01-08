Rails.application.routes.draw do

  # action cable server
  mount ActionCable.server => "/websoket"

  resources :messages
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "messages#index"
end
