import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button
} from '@chakra-ui/react';

const StakersModal = ({
  stakersModalStatus,
  setStakersModalStatus,
  stakers
}) => {
  return (
    <Modal
      onClose={() => setStakersModalStatus(false)}
      isOpen={stakersModalStatus}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Stakers</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {stakers &&
            stakers.map((item, index) => {
              return (
                <div className='stakers-container' key={index}>
                  <p>{item.address}</p>
                  <p>{item.amount}</p>
                </div>
              );
            })}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              setStakersModalStatus(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StakersModal;
