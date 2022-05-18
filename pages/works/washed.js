import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  AspectRatio,
  Center,
  Image
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="WASHEd">
    <Container>
      <Center my={6}>
        <Image src="/images/works/washed.png" alt="icon" />
      </Center>
      <Center my={6}>
        <Image src="/images/works/facts.png" alt="icon" />
      </Center>
      <Title>
        WASHEd <Badge>2017</Badge>
      </Title>
      <P>
        Washed is an innovative Learning Curriculum created by Masy Consultants, aimed at transforming community WASH behaviours, one module at a time. WASHEd is developed specially for schools, parents and community educators and primarily focuses on teaching water sanitation to individuals in developing countries. 
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Any device with internet access</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>React, Gatsby, Tailwind CSS</span>
        </ListItem>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="https://washed-beta.netlify.app/">https://washed-beta.netlify.app/
          </Link>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
