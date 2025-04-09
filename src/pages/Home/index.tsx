import { useEffect, useState } from 'react'
import { CoffeeCard } from '../../components/CoffeeCard'
import { Coffee, Package, ShoppingCart, Timer } from '@phosphor-icons/react'
import { useTheme } from 'styled-components'

import { CoffeeList, Heading, Hero, HeroContent, Info } from './styles'
import { api } from '../../serves/api'

interface Coffee {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  image: string;
  quantity: number;
};

export function Home() {
  const theme = useTheme();
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Coffee[]>('/coffees')
      .then((response) => {
        const coffeesWithQuantity = response.data.map(coffee => ({
          ...coffee,
          quantity: 1,
        }))
        setCoffees(coffeesWithQuantity)
      })
      .catch(error => {
        console.error('Erro ao buscar cafés:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  function incrementQuantity(id: string) {
    setCoffees(prev =>
      prev.map(coffee =>
        coffee.id === id && coffee.quantity < 5
          ? { ...coffee, quantity: coffee.quantity + 1 }
          : coffee
      )
    )
  }

  function decrementQuantity(id: string) {
    setCoffees(prev =>
      prev.map(coffee =>
        coffee.id === id && coffee.quantity > 1
          ? { ...coffee, quantity: coffee.quantity - 1 }
          : coffee
      )
    )
  }

  return (
    <div>
      <Hero>
        <HeroContent>
          <div>
            <Heading>
              <h1>Encontre o café perfeito para qualquer hora do dia</h1>

              <span>
                Com o Coffee Delivery você recebe seu café onde estiver, a
                qualquer hora
              </span>
            </Heading>

            <Info>
              <div>
                <ShoppingCart
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['yellow-dark'] }}
                />
                <span>Compra simples e segura</span>
              </div>

              <div>
                <Package
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['base-text'] }}
                />
                <span>Embalagem mantém o café intacto</span>
              </div>

              <div>
                <Timer
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.yellow }}
                />
                <span>Entrega rápida e rastreada</span>
              </div>

              <div>
                <Coffee
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.purple }}
                />
                <span>O café chega fresquinho até você</span>
              </div>
            </Info>
          </div>

          <img src="/images/hero.svg" alt="Café do Coffee Delivery" />
        </HeroContent>

        <img src="/images/hero-bg.svg" id="hero-bg" alt="" />
      </Hero>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          Aguarde, estamos preparando o melhor café pra você!
        </p>
      ) : (
        <CoffeeList>
          <h2>Nossos cafés</h2>
          <div>
            {coffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
              />
            ))}
          </div>
        </CoffeeList>
      )}
    </div>
  )
}
