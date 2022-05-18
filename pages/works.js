import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'

import mindfulness from '../public/images/works/mindfulness.png'
import washed from '../public/images/works/washed.png'
import diabetes from '../public/images/works/diabetes.jpeg'
import async from '../public/images/works/async.png'
import portfolio from '../public/images/works/portfolio.png'

const Works = () => (
  <Layout title="Works">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Works
      </Heading>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section>
          <WorkGridItem id="mindfulness" title="Mindfulness Tracker" thumbnail={mindfulness}>
            Building a full stack meditation tracking project utilising the MERN stack
          </WorkGridItem>
        </Section>
        <Section>
          <WorkGridItem
            id="diabetes"
            title="Classifying Diabetes"
            thumbnail={diabetes}
          >
            Classifying the presence of diabetes from scratch using analytics
          </WorkGridItem>
        </Section>
        <Section>
          <WorkGridItem
            id="portfolio"
            title="Personal Portfolio"
            thumbnail={portfolio}
          >
            A person portfolio to display projects
          </WorkGridItem>
        </Section>
      </SimpleGrid>

      <Section delay={0.2}>
        <Divider my={6} />

        <Heading as="h3" fontSize={20} mb={4}>
          Async Development
        </Heading>
      </Section>

      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        <Section delay={0.3}>
          <WorkGridItem id="async" thumbnail={async} title="Async Development">
            An aesthetic company website for Async Development
          </WorkGridItem>
        </Section>
        <Section delay={0.3}>
          <WorkGridItem
            id="washed"
            thumbnail={washed}
            title="WASHEd"
          >
            Innovative curriculum platform for sanitation practices
          </WorkGridItem>
        </Section>
      </SimpleGrid>
    </Container>
  </Layout>
)

export default Works
export { getServerSideProps } from '../components/chakra'
