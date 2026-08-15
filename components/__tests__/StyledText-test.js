import renderer from "react-test-renderer";

import { MonoText } from "../StyledText";

it(`renders correctly`, () => {
  let testRenderer;

  renderer.act(() => {
    testRenderer = renderer.create(<MonoText>Snapshot test!</MonoText>);
  });

  const tree = testRenderer.toJSON();

  expect(tree).toMatchSnapshot();

  renderer.act(() => {
    testRenderer.unmount();
  });
});
