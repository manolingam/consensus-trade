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

const TransactionModal = ({ txModalStatus, txId, setTxModalStatus }) => {
  return (
    <Modal
      onClose={() => setTxModalStatus(false)}
      isOpen={txModalStatus}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transaction Submitted!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>
            It takes variable time to update the state. By the time, you can
            check yout transaction status{' '}
            <a
              id='transaction-id'
              href={`https://viewblock.io/arweave/tx/${txId}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              here.
            </a>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              setTxModalStatus(false);
              window.location.href = '/';
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionModal;
