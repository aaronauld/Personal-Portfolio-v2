import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => {
    return(
        <Layout title="Inkdrop">
            <Container>
                <Title>
                    Inkdrop <Badge>2016</Badge>
                </Title>
                <p>
                    A Markdown note-taking app with 100+ plugins, cross-platform and encrypted data
                </p>
                <List ml={4} my={4}>
                    <ListItem>
                        <Meta>Website</Meta>
                        <Link href='https://www.google.com'>
                            https://www.google.com <ExternalLinkIcon mx="2px" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Meta>Platform</Meta>
                        <span>Windows/macOS/Linux/iOS/Android</span>
                    </ListItem>
                    <ListItem>
                        <Meta>Stack</Meta>
                        <span>NodeJS, Elecrton, React Native</span>
                    </ListItem>
                    <ListItem>
                        <Meta>Blogpost</Meta>
                        <Link href=''>
                            How I&apos;ve Attracted the First 500 Paid Users For My SaaS <ExternalLinkIcon mx="2px" />
                        </Link>
                    </ListItem>
                </List>

                <WorkImage src="/images/works/inkdrop_01.png" alt="Inkdrop" />
                <WorkImage src="/images/works/inkdrop_02.png" alt="Inkdrop" />
            </Container>
        </Layout>
    )
}

export default Work